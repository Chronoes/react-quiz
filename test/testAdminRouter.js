import {expect} from 'chai';

import {Request, Response} from './mocks';
import {validateIdParam} from '../server/routes/admin-router.js';
import getQuizList from '../server/routes/admin/getQuizList';
import getQuiz from '../server/routes/admin/getQuiz';
import getQuizUsers from '../server/routes/admin/getQuizUsers';
import getUser from '../server/routes/admin/getUser';

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

  describe('/quiz/:quizId route', () => {
    describe('parameter validation', () => {
      const validateQuizIdParam = validateIdParam('quizId')[1];

      it('should assign valid ID to request parameters', () => {
        const req = new Request({}, {quizId: 3});
        const res = new Response();

        expect(validateQuizIdParam(req, res, () => true)).to.be.true;
        expect(req.params.quizId).to.equal(3);
      });

      it('should respond with Bad Request if ID is not a number', () => {
        const req = new Request({}, {quizId: 'not a number'});
        const res = new Response();

        validateQuizIdParam(req, res, () => true);
        expect(res.statusCode).to.equal(400);
        expect(res.sentBody.message).to.have.length.above(0);
      });
    });

    describe('GET request', () => {
      it('should respond with a quiz on existing ID', (done) => {
        const req = new Request({}, {quizId: 1});
        const res = new Response();

        return getQuiz(req.setPath('/quiz/1'), res)
        .then(() => {
          expect(res.statusCode).to.equal(200);
          expect(res.sentBody).to.have.all.keys(
            'id', 'status', 'title', 'timeLimit', 'createdAt', 'updatedAt', 'questions');
          done();
        })
        .catch(done);
      });

      it('should respond with Not Found if quiz with given ID does not exist', (done) => {
        const req = new Request({}, {quizId: 9999999});
        const res = new Response();

        return getQuiz(req, res)
        .then(() => {
          expect(res.statusCode).to.equal(404);
          expect(res.sentBody.message).to.have.length.above(0);
          done();
        })
        .catch(done);
      });

      it('should call next handler if path does not end with ID', (done) => {
        const req = new Request({}, {quizId: 1});
        const res = new Response();

        return getQuiz(req.setPath('/quiz/1/something'), res, () => true)
        .then((called) => {
          expect(called).to.be.true;
          expect(req).to.have.any.keys('quiz');
          done();
        })
        .catch(done);
      });

      describe('/users route', () => {
        describe('GET request', () => {
          it('should respond with a list of users who have answered the quiz', (done) => {
            const req = new Request({}, {quizId: 1});
            const res = new Response();

            return getQuiz(req.setPath('/quiz/1/users'), res, () => true)
            .then((called) => {
              expect(called).to.be.true;
              expect(req).to.have.any.keys('quiz');
              return getQuizUsers(req, res);
            })
            .then(() => {
              expect(res.statusCode).to.equal(200);
              expect(res.sentBody).to.be.an('array');
              expect(res.sentBody).to.have.length.at.least(3);
              expect(res.sentBody[0]).to.have.all.keys('id', 'name', 'timeSpent', 'createdAt');
              done();
            })
            .catch(done);
          });
        });
      });
    });
  });

  describe('/user/:userId', () => {
    it('should respond with user and their answers', (done) => {
      const req = new Request({}, {userId: 2});
      const res = new Response();

      return getUser(req, res)
      .then(() => {
        expect(res.statusCode).to.equal(200);
        expect(res.sentBody).to.have.all.keys('quizId', 'questions', 'createdAt', 'timeSpent', 'name');
        expect(res.sentBody.questions).to.be.an('array');
      })
      .catch(done);
    });
  });
});
