import {expect} from 'chai';
import getQuiz from '../server/routes/quiz/getQuiz';
import saveQuizAnswers from '../server/routes/quiz/saveQuizAnswers';
import {Quiz, Question, QuestionChoice, User} from '../server/database';
import {Request, Response} from './mocks';

describe('API Quiz route', () => {
  describe('GET request', () => {
    it('should respond with quiz data and created user hash', (done) => {
      const req = new Request({name: 'dis be name'});
      const res = new Response();

      return Quiz.create({title: 'Quiz test', timeLimit: 300})
      .then(() => getQuiz(req, res)
        .then(() => {
          expect(res.statusCode).to.equal(200);
          expect(res.sentBody).to.have.all.keys('id', 'userHash', 'title', 'timeLimit', 'questions');
          done();
        }))
      .catch(done);
    });

    it('should respond with Bad Request if name parameter missing or invalid', () => {
      const req = new Request({name: ''});
      const res = new Response();

      getQuiz(req, res);
      expect(res.statusCode).to.equal(400);
      expect(res.sentBody.message).to.have.length.above(0);
    });

    before(() => {
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
    });
  });

  describe('POST request', () => {
    it('should save sent answers and respond with number of correct answers', (done) => {
      const answers = {
        userHash: 'testhash',
        timeSpent: 930,
        questions: [
          {id: 100, answer: 101},
          {id: 101, answer: [103, 105]},
          {id: 102, answer: ['correct answer']},
          {id: 103, answer: '<irrelevant text here>'},
        ],
      };

      const req = (new Request()).setBody(answers);
      const res = new Response();

      return Quiz.create(
        {
          title: 'a testing quiz',
          timeLimit: 30 * 60,
          questions: [
            {id: 100, type: 'radio', question: 'a nice title', questionChoices: [
              {id: 100, value: 'impossible', isAnswer: false},
              {id: 101, value: 'improbable', isAnswer: true},
              {id: 102, value: 'inexplicable', isAnswer: false},
            ]},
            {id: 101, type: 'checkbox', question: 'some other title', questionChoices: [
              {id: 103, value: 'irrevocable', isAnswer: false},
              {id: 104, value: 'illogical', isAnswer: true},
              {id: 105, value: 'insurmountable', isAnswer: true},
              {id: 106, value: 'illegal', isAnswer: false},
            ]},
            {id: 102, type: 'fillblank', question: 'irrelevant', questionChoices: [
              {value: 'correct answer', isAnswer: true},
            ]},
            {id: 103, type: 'textarea', question: 'lorem ipsum', questionChoices: []},
          ],
        }, {include: [{model: Question, include: [QuestionChoice]}]})
        .then((quiz) => User.create({name: 'random name', hash: 'testhash'})
          .then((user) => user.setQuiz(quiz.id)
            .then(() => saveQuizAnswers(req, res))
            .then(() => User.scope('withAnswers').count({where: {id: user.id}}))))
        .then((answerCount) => {
          expect(answerCount).to.equal(6);
          expect(res.sentBody).to.deep.equal({correctAnswers: 2});
          done();
        })
        .catch(done);
    });

    context('on faulty parameters', () => {
      it('should respond with Bad Request on invalid body parameters', () => {
        const req = new Request();
        const res = new Response();

        saveQuizAnswers(req.setBody({userHash: '', questions: [{id: 3, answer: 'whatever'}]}), res);
        expect(res.statusCode).to.equal(400);
        expect(res.sentBody.message).to.have.length.above(0);
        expect(res.sentBody.errors).to.be.an('array');
        expect(res.sentBody.errors).to.have.lengthOf(2);

        saveQuizAnswers(req.setBody({questions: [{id: 3, answer: 'whatever'}]}), res);
        expect(res.statusCode).to.equal(400);
        expect(res.sentBody.message).to.have.length.above(0);
        expect(res.sentBody.errors).to.be.an('array');
        expect(res.sentBody.errors).to.have.lengthOf(2);

        saveQuizAnswers(
          req.setBody({questions: [{id: 3, answer: 'whatever'}], userHash: 'randomhash', timeSpent: -23}), res);
        expect(res.statusCode).to.equal(400);
        expect(res.sentBody.message).to.have.length.above(0);
        expect(res.sentBody.errors).to.be.an('array');
        expect(res.sentBody.errors).to.have.lengthOf(1);
      });
    });

    it('should respond with Not Found if user does not exist', (done) => {
      const answers = {
        userHash: 'this hash does not exist',
        timeSpent: 930,
        questions: [
          {id: 100, answer: 101},
          {id: 101, answer: [103, 105]},
          {id: 102, answer: ['correct answer']},
          {id: 103, answer: '<irrelevant text here>'},
        ],
      };

      const req = (new Request()).setBody(answers);
      const res = new Response();

      return saveQuizAnswers(req, res)
      .then(() => {
        expect(res.statusCode).to.equal(404);
        expect(res.sentBody.message).to.have.length.above(0);
        done();
      })
      .catch(done);
    });
  });
});
