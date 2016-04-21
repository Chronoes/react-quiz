import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import * as util from '../server/util';

describe('Utility functions', () => {
  describe('#verifyToken()', () => {
    it('should return payload with correct token', (done) => {
      const secret = 'shhhhh';
      const token = jwt.sign({ id: 1, username: 'ayylmao' }, secret);
      util.verifyToken(token, secret)
      .then((payload) => {
        expect(payload).to.be.an('object');
        expect(payload).to.have.all.keys('iat', 'id', 'username');
        expect(payload.id).to.equal(1);
        expect(payload.username).to.equal('ayylmao');
        done();
      })
      .catch(done);
    });

    it('should reject with error on incorrect token', (done) => {
      const token = jwt.sign({ id: 1, username: 'ayylmao' }, 'customSecret');
      util.verifyToken(token, 'shhhhh')
      .then(() => done(new Error('This path shouldn\'t be taken')))
      .catch((err) => {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.have.length.above(0);
        done();
      });
    });
  });

  describe('#verifyAuthorization()', () => {
    it('should return with token if Authorization header exists', (done) => {
      const secret = 'shhhhh';
      const token = jwt.sign({ id: 1, username: 'ayylmao' }, secret);
      const authHeader = `Bearer ${token}`;
      util.verifyAuthorization(authHeader, secret)
      .then((payload) => {
        expect(payload).to.be.an('object');
        expect(payload).to.have.all.keys('iat', 'id', 'username');
        expect(payload.id).to.equal(1);
        expect(payload.username).to.equal('ayylmao');
        done();
      })
      .catch(done);
    });

    it('should reject with error on missing header', (done) => {
      util.verifyAuthorization('', '')
      .then(() => done(new Error('This path shouldn\'t be taken')))
      .catch((err) => {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.equal('No Authorization header.');
        done();
      });
    });
  });

  describe('#genChecksum()', () => {
    it('should return a SHA-1 hash of given payload', () => {
      expect(util.genChecksum({ id: 30, name: 'not my name' })).to.equal('96c25ed3edb27be12e2d4852194b7e6ca463e639');
      expect(util.genChecksum({
        value: 23023, index: 3, name: '',
      })).to.equal('17b2809b18200c1ebf4b9f5cd49f53cdbee3067e');
    });
  });

  describe('#verifyChecksum()', () => {
    it('should verify given payload against given hash', () => {
      expect(util.verifyChecksum({ id: 30, name: 'not name' }, '02cae401802f199f6881ec800fac0e978be527d2')).to.be.true;
      expect(util.verifyChecksum({ id: 31, name: 'not name' }, '02cae401802f199f6881ec800fac0e978be527d2')).to.be.false;
    });
  });

  describe('#parseNumberDefault()', () => {
    it('should return a number within given range if value is a number', () => {
      expect(util.parseNumberDefault(13, 30)).to.equal(13);
      expect(util.parseNumberDefault(18, 12)).to.equal(12);
      expect(util.parseNumberDefault(-5, 121)).to.equal(0);
      expect(util.parseNumberDefault(-11, 10, -1)).to.equal(-1);
    });

    it('should return the end of the range if value is not a number', () => {
      expect(util.parseNumberDefault('eew', 30)).to.equal(30);
      expect(util.parseNumberDefault(undefined, 10, 1)).to.equal(10);
    });
  });

  describe('#partialPick()', () => {
    it('should return a function that creates a new object based on given prop names', () => {
      const keys = ['some', 'stuff'];
      const boundPartialPick = util.partialPick(keys);

      expect(boundPartialPick).to.be.a('function');
      expect(boundPartialPick({})).to.be.empty;
      expect(boundPartialPick(
        { some: '142', things: 13.9, to: [2, 3, 5, 7], be: {}, stuff: true }))
        .to.deep.equal({ some: '142', stuff: true });
      expect(util.partialPick([['change', 'take'], ['keys', 'cupcakes'], 'not'])({
        change: 'these', keys: 'please', not: 'this', ignore: true,
      })).to.deep.equal({ take: 'these', cupcakes: 'please', not: 'this' });
    });
  });

  describe('#partialOmit()', () => {
    it('should return a function that creates a new object, omitting given prop names', () => {
      const keys = ['some', 'stuff'];
      const boundPartialOmit = util.partialOmit(keys);

      expect(boundPartialOmit).to.be.a('function');
      expect(boundPartialOmit({})).to.be.empty;
      expect(boundPartialOmit(
        { some: '142', things: 13.9, to: [2, 3, 5, 7], be: {}, stuff: true }))
        .to.deep.equal({ things: 13.9, to: [2, 3, 5, 7], be: {} });
    });
  });
});
