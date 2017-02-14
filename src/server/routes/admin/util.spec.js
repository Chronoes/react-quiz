import * as util from './util';

describe.skip('#validateQuiz()', () => {
  it.only('should resolve on correct data', () => {
    const quiz = {
      title: 'Cool stuff',
      status: 'active',
      timeLimit: 93,
      questions: [],
    };

    return util.validateQuiz(quiz)
    .then((validated) => {
      expect(validated).toEqual(quiz);
    });
  });

  it('should reject on invalid title', () => {
    const quiz = {
      title: '',
      status: 'active',
      timeLimit: 93,
      questions: [],
    };

    return util.validateQuiz(quiz)
    .catch((err) => {
      expect(err).toBeInstanceOf(util.ValidationError);
    })
    .then(() => Promise.reject(new Error(`Invalid title '${quiz.title}' should be rejected`)));
  });

  it('should reject on invalid status', (done) => {
    const quiz = {
      title: 'Correct title',
      status: 'impossible',
      timeLimit: 122,
      questions: [],
    };

    return util.validateQuiz(quiz)
    .then(() => done(new Error(`Invalid status '${quiz.status}' should be rejected`)))
    .catch((err) => {
      expect(err).toBeInstanceOf(util.ValidationError);
      done();
    });
  });

  it('should reject on invalid timeLimit', (done) => {
    const quiz = {
      title: 'Correct title',
      status: 'passive',
      timeLimit: 0,
      questions: [],
    };

    return util.validateQuiz(quiz)
    .then(() => done(new Error(`Invalid status '${quiz.status}' should be rejected`)))
    .catch((err) => {
      expect(err).toBeInstanceOf(util.ValidationError);
      done();
    });
  });

  it('should reject on invalid questions', (done) => {
    const quiz = {
      title: 'Correct title',
      status: 'passive',
      timeLimit: 122,
    };

    return util.validateQuiz(quiz)
    .then(() => done(new Error(`Invalid status '${quiz.status}' should be rejected`)))
    .catch((err) => {
      expect(err).toBeInstanceOf(util.ValidationError);
      done();
    });
  });
});
