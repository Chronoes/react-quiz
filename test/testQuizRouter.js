import {expect} from 'chai';
import getQuiz from '../server/routes/quiz/getQuiz';
import {Quiz} from '../server/database';
import {Request, Response} from './mocks';

describe('API Quiz route', () => {
  describe('GET request', () => {
    it('should respond with quiz data and created user hash', (done) => {
      const req = new Request({name: 'dis be name'});
      const res = new Response();

      return Quiz.create({title: 'Quiz test', timeLimit: 300})
      .then((quiz) => getQuiz(req, res)
        .then(() => {
          expect(res.statusCode).to.equal(200);
          expect(res.sentBody).to.have.all.keys('id', 'status', 'userHash', 'title', 'timeLimit', 'questions');
          expect(res.sentBody.title).to.equal(quiz.title);
          expect(res.sentBody.timeLimit).to.equal(quiz.timeLimit);
          done();
        }))
      .catch(done);
    });

    it('should respond with Not Found if no quizzes are active', (done) => {
      const req = new Request({name: 'dis be name'});
      const res = new Response();

      return Quiz.truncate({cascade: true})
      .then(() => getQuiz(req, res))
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
  });

  describe('POST request', () => {
    it('should validate and save sent answers and respond with number of correct answers');

    it('should respond with Bad Request on invalid body parameters');
  });
});
