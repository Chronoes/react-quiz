import {expect} from 'chai';
import getQuiz from '../server/routes/quiz/getQuiz';
import {Request, Response} from './mocks';

describe('API Quiz route', () => {
  context('GET request', () => {
    it('should respond with quiz data and created user id', (done) => {
      const req = new Request({name: 'dis be name'});
      const res = new Response();

      return getQuiz(req, res)
      .then(() => {
        expect(res.statusCode).to.equal(200);
        expect(res.sentBody).to.not.be.empty;
        done();
      })
      .catch(done);
    });

    it('should respond with Not Found if no quizzes are active', (done) => {
      const req = new Request({name: 'dis be name'});
      const res = new Response();

      return getQuiz(req, res)
      .then(() => {
        expect(res.statusCode).to.equal(404);
        expect(res.sentBody.message).to.have.length.above(0);
        done();
      })
      .catch(done);
    });

    it('should respond with Bad Request if name parameter missing or invalid', () => {
      const req = new Request({name: ''});
      const res = new Response();

      getQuiz(req, res);
      expect(res.statusCode).to.equal(400);
      expect(res.sentBody.message).to.have.length.above(0);
    });

    it('should respond with Server Error if database queries fail');
  });
});
