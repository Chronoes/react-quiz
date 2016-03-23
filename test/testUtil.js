import {expect} from 'chai';
import jwt from 'jsonwebtoken';

import * as util from '../server/util';

describe('Utility functions', () => {
  context('#verifyToken()', () => {
    it('should return payload with correct token', (done) => {
      const secret = 'shhhhh';
      const token = jwt.sign({id: 1, username: 'ayylmao'}, secret);
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
      const token = jwt.sign({id: 1, username: 'ayylmao'}, 'customSecret');
      util.verifyToken(token, 'shhhhh')
      .then(() => done(new Error('This path shouldn\'t be taken')))
      .catch((err) => {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.have.length.above(0);
        done();
      });
    });
  });

  context('#verifyAuthorization()', () => {
    it('should return with token if Authorization header exists', (done) => {
      const secret = 'shhhhh';
      const token = jwt.sign({id: 1, username: 'ayylmao'}, secret);
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
});
