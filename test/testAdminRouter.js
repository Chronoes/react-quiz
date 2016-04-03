import {expect} from 'chai';

import {Request, Response} from './mocks';
import {validateIdParam} from '../server/routes/admin-router.js';
import getQuizList from '../server/routes/admin/getQuizList';
import getQuiz from '../server/routes/admin/getQuiz';

describe('API Admin route', () => {
  describe('/quiz route', () => {
    describe('GET request', () => {
      it('should return a list of quizzes', (done) => {
        const req = new Request();
        const res = new Response();

        return getQuizList(req, res)
        .then(() => {
          expect(res.sentBody).to.be.an('array');
          expect(res.sentBody).to.have.length.at.least(2);
          expect(res.sentBody[0]).to.be.an('object');
          expect(res.sentBody[0]).to.have.all.keys(
            'id', 'status', 'title', 'timeLimit', 'createdAt', 'updatedAt', 'users');
          done();
        })
        .catch(done);
      });

      it('should return a list of quizzes limited by query options', (done) => {
        const req = new Request({limit: 1, offset: 1});
        const res = new Response();

        return getQuizList(req, res)
        .then(() => {
          expect(res.sentBody).to.be.an('array');
          expect(res.sentBody).to.have.lengthOf(1);
          expect(res.sentBody[0]).to.be.an('object');
          expect(res.sentBody[0]).to.have.all.keys(
            'id', 'status', 'title', 'timeLimit', 'createdAt', 'updatedAt', 'users');
          done();
        })
        .catch(done);
      });
    });
  });

  describe('/quiz/:id route', () => {
    describe('parameter validation', () => {
      it('should assign valid ID to request parameters', () => {
        const req = new Request({}, {id: 3});
        const res = new Response();

        expect(validateIdParam(req, res, () => true)).to.be.true;
        expect(req.params.id).to.equal(3);
      });

      it('should respond with Bad Request if ID is not a number', () => {
        const req = new Request({}, {id: 'not a number'});
        const res = new Response();

        validateIdParam(req, res, () => true);
        expect(res.statusCode).to.equal(400);
        expect(res.sentBody.message).to.have.length.above(0);
      });
    });

    describe('GET request', () => {
      it('should respond with a quiz on existing ID', (done) => {
        const req = new Request({}, {id: 1});
        const res = new Response();

        return getQuiz(req, res)
        .then(() => {
          expect(res.statusCode).to.equal(200);
          expect(res.sentBody).to.have.all.keys(
            'id', 'status', 'title', 'timeLimit', 'createdAt', 'updatedAt', 'questions');
          done();
        })
        .catch(done);
      });

      it('should respond with Not Found if quiz with given ID does not exist', (done) => {
        const req = new Request({}, {id: 9999999});
        const res = new Response();

        return getQuiz(req, res)
        .then(() => {
          expect(res.statusCode).to.equal(404);
          expect(res.sentBody.message).to.have.length.above(0);
          done();
        })
        .catch(done);
      });
    });
  });
});
