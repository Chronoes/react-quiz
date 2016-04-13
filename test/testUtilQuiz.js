import { expect } from 'chai';
import * as util from '../server/routes/quiz/utilQuiz';

describe('Quiz utility functions', () => {
  const questions = [
    {
      id: 1,
      type: 'checkbox',
      question: 'is it ok?',
      questionChoices: [
        { id: 1, isAnswer: true, value: 'yes' },
        { id: 2, isAnswer: false, value: 'maybe' },
        { id: 3, isAnswer: true, value: 'no' },
      ],
    },
    {
      id: 2,
      type: 'radio',
      question: 'maybe it is now?',
      questionChoices: [
        { id: 5, isAnswer: false, value: 'yes' },
        { id: 6, isAnswer: true, value: 'maybe' },
      ],
    },
    {
      id: 40,
      type: 'fillblank',
      question: 'oh dear',
      questionChoices: [
        { id: 10, isAnswer: true, value: 'yes' },
        { id: 11, isAnswer: true, value: 'yes twice' },
        { id: 12, isAnswer: true, value: '30' },
      ],
    },
    {
      id: 11,
      type: 'textarea',
      question: 'oh dear',
      questionChoices: [],
    },
  ];

  describe('#validateAnswer()', () => {
    const validateAnswer = util.validateAnswer(questions);

    it('should resolve with correctly parsed answers for radio', (done) => {
      validateAnswer({ id: 2, answer: 6 })
      .then((parsed) => {
        expect(parsed).to.deep.equal({ questionId: 2, answer: 6 });
        done();
      })
      .catch(done);
    });

    it('should resolve with correctly parsed answers for checkbox', (done) => {
      validateAnswer({ id: 1, answer: [12, 2, 3] })
      .then((parsed) => {
        expect(parsed).to.deep.equal({ questionId: 1, answer: [12, 2, 3] });
        done();
      })
      .catch(done);
    });

    it('should resolve with correctly parsed answers for fillblank', (done) => {
      validateAnswer({ id: 40, answer: ['answer'] })
      .then((parsed) => {
        expect(parsed).to.deep.equal({ questionId: 40, answer: ['answer'] });
        done();
      })
      .catch(done);
    });

    it('should resolve with correctly parsed answers for textarea', (done) => {
      validateAnswer({ id: 11, answer: 'full answer for textarea' })
      .then((parsed) => {
        expect(parsed).to.deep.equal({ questionId: 11, answer: 'full answer for textarea' });
        done();
      })
      .catch(done);
    });

    context('on invalid answer format', () => {
      it('should reject with error on non-Object answer', (done) => {
        validateAnswer('not an object')
        .then(() => done(new Error('String is not an Object')))
        .catch((err) => {
          expect(err).to.be.an('error');
          expect(err.message).to.equal('User answer must be an object');
          done();
        })
        .catch(done);
      });

      it('should reject with error on missing values or invalid id', (done) => {
        validateAnswer({ bogusKey: -1, answer: 'oh' })
        .then(() => done(new Error('Missing \'id\' key')))
        .catch((err) => {
          expect(err).to.be.an('error');
          expect(err.message).to.have.string('User answer format:');
          return validateAnswer({ id: 3 });
        })
        .then(() => done(new Error('Missing \'answer\' key')))
        .catch((err) => {
          expect(err).to.be.an('error');
          expect(err.message).to.have.string('User answer format:');
          return validateAnswer({ id: 0, answer: '' });
        })
        .then(() => done(new Error('Invalid \'id\' key')))
        .catch((err) => {
          expect(err).to.be.an('error');
          expect(err.message).to.have.string('User answer format:');
          done();
        })
        .catch(done);
      });
    });

    context('on invalid answers', () => {
      it('should reject with error if given question ID does not exist', (done) => {
        validateAnswer({ id: 666, answer: 'welp' })
        .then(() => done(new Error('No such question ID')))
        .catch((err) => {
          expect(err).to.be.an('error');
          expect(err.message).to.equal('Question ID 666 does not exist');
          done();
        })
        .catch(done);
      });

      it('should reject with error on invalid answer type for radio', (done) => {
        validateAnswer({ id: 2, answer: 'not an integer' })
        .then(() => done(new Error('String was validated as Number')))
        .catch((err) => {
          expect(err).to.be.an('error');
          expect(err.message).to.match(/Malformed user answer.+expected Number.+type radio.+/);
          done();
        })
        .catch(done);
      });

      it('should reject with error on invalid answer type for checkbox', (done) => {
        validateAnswer({ id: 1, answer: [3, null, 54] })
        .then(() => done(new Error('Array containing null was validated as Array of Numbers')))
        .catch((err) => {
          expect(err).to.be.an('error');
          expect(err.message).to.match(/Malformed user answer.+expected Array of Numbers.+type checkbox.+/);
          done();
        })
        .catch(done);
      });

      it('should reject with error on invalid answer type for fillblank', (done) => {
        validateAnswer({ id: 40, answer: [1, 'nr2'] })
        .then(() => done(new Error('Array containing a Number was validated as Array of Strings')))
        .catch((err) => {
          expect(err).to.be.an('error');
          expect(err.message).to.match(/Malformed user answer.+expected Array of Strings.+type fillblank.+/);
          done();
        })
        .catch(done);
      });

      it('should reject with error on invalid answer type for textarea', (done) => {
        validateAnswer({ id: 11, answer: {} })
        .then(() => done(new Error('Object was validated as String')))
        .catch((err) => {
          expect(err).to.be.an('error');
          expect(err.message).to.match(/Malformed user answer.+expected String.+type textarea.+/);
          done();
        })
        .catch(done);
      });
    });
  });

  describe('#verifyAnswer()', () => {
    const verifyAnswer = util.verifyAnswer(questions);

    function runVerificationTest(falseAnswer, trueAnswer) {
      return (done) => verifyAnswer(falseAnswer)
      .then((verified) => {
        expect(verified).to.deep.equal({ ...falseAnswer, isCorrect: false });
        return verifyAnswer(trueAnswer);
      })
      .then((verified) => {
        expect(verified).to.deep.equal({ ...trueAnswer, isCorrect: true });
        done();
      })
      .catch(done);
    }

    it('should resolve with verified answer for radio',
      runVerificationTest({ questionId: 2, answer: 5 }, { questionId: 2, answer: 6 }));

    it('should resolve with verified answer for checkbox',
      runVerificationTest({ questionId: 1, answer: [1, 2, 3] }, { questionId: 1, answer: [3, 1] }));

    it('should resolve with verified answer for fillblank',
      runVerificationTest(
        { questionId: 40, answer: ['yes', 'no'] }, { questionId: 40, answer: ['yes', 'yes twice', '30'] }));

    it('should resolve with verified answer for textarea', (done) => {
      const answer = { questionId: 11, answer: 'some random text' };

      verifyAnswer(answer)
      .then((verified) => {
        expect(verified).to.deep.equal({ ...answer, isCorrect: null });
        done();
      })
      .catch(done);
    });
  });
});
