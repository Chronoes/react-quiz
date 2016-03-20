import {expect} from 'chai';
import jwt from 'jsonwebtoken';

import * as util from '../server/util';

describe('Utility functions', () => {
  context('#verifyToken()', () => {
    it('should return payload with correct token', (done) => {
      const token = util.signToken({id: 1, username: 'ayylmao'});
      util.verifyToken(token)
      .then((payload) => {
        expect(payload).to.be.an('object');
        expect(payload).to.have.all.keys('exp', 'iat', 'id', 'username');
        expect(payload.id).to.equal(1);
        expect(payload.username).to.equal('ayylmao');
        done();
      })
      .catch(done);
    });

    it('should reject with error on incorrect token', (done) => {
      const token = jwt.sign({id: 1, username: 'ayylmao'}, 'shhhhh');
      util.verifyToken(token)
      .then(() => done(new Error('This path shouldn\'t be taken')))
      .catch((err) => {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.equal('Token is invalid.');
        done();
      });
    });
  });

  context('#verifyAuthorization()', () => {
    it('should return with token if Authorization header exists', (done) => {
      const token = util.signToken({id: 1, username: 'ayylmao'});
      const authHeader = `Bearer ${token}`;
      util.verifyAuthorization(authHeader)
      .then((payload) => {
        expect(payload).to.be.an('object');
        expect(payload).to.have.all.keys('exp', 'iat', 'id', 'username');
        expect(payload.id).to.equal(1);
        expect(payload.username).to.equal('ayylmao');
        done();
      })
      .catch(done);
    });

    it('should reject with error on missing header', (done) => {
      util.verifyAuthorization('')
      .then(() => done(new Error('This path shouldn\'t be taken')))
      .catch((err) => {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.equal('No Authorization header.');
        done();
      });
    });
  });
});
