import * as util from './quiz';

const questions = [
  {
    questionId: 1,
    type: 'checkbox',
    question: 'is it ok?',
    choices: [
      { questionChoiceId: 1, isAnswer: true, value: 'yes' },
      { questionChoiceId: 2, isAnswer: false, value: 'maybe' },
      { questionChoiceId: 3, isAnswer: true, value: 'no' },
    ],
  },
  {
    questionId: 2,
    type: 'radio',
    question: 'maybe it is now?',
    choices: [
      { questionChoiceId: 5, isAnswer: false, value: 'yes' },
      { questionChoiceId: 6, isAnswer: true, value: 'maybe' },
    ],
  },
  {
    questionId: 40,
    type: 'fillblank',
    question: 'oh dear',
    choices: [
      { questionChoiceId: 10, isAnswer: true, value: 'yes' },
      { questionChoiceId: 11, isAnswer: true, value: 'yes twice' },
      { questionChoiceId: 12, isAnswer: true, value: '30' },
    ],
  },
  {
    questionId: 11,
    type: 'textarea',
    question: 'oh dear',
    choices: [],
  },
];

describe('#validateAnswer()', () => {
  const validateAnswer = util.validateAnswer(questions);

  it('should resolve with correctly parsed answers for radio', () =>
    validateAnswer({ questionId: 2, answer: 6 })
    .then((parsed) => {
      expect(parsed).toEqual({ questionId: 2, answer: 6 });
    })
  );

  it('should resolve with correctly parsed answers for checkbox', () =>
    validateAnswer({ questionId: 1, answer: [12, 2, 3] })
    .then((parsed) => {
      expect(parsed).toEqual({ questionId: 1, answer: [12, 2, 3] });
    })
  );

  it('should resolve with correctly parsed answers for fillblank', () =>
    validateAnswer({ questionId: 40, answer: ['answer'] })
    .then((parsed) => {
      expect(parsed).toEqual({ questionId: 40, answer: ['answer'] });
    })
  );

  it('should resolve with correctly parsed answers for textarea', () =>
    validateAnswer({ questionId: 11, answer: 'full answer for textarea' })
    .then((parsed) => {
      expect(parsed).toEqual({ questionId: 11, answer: 'full answer for textarea' });
    })
  );

  describe('on invalid answer format', () => {
    it('should reject with error on non-Object answer', () =>
      validateAnswer('not an object')
      .then(() => Promise.reject(new Error('String is not an Object')))
      .catch((err) => {
        expect(err.message).toBe('User answer must be an object');
      })
    );

    it('should reject with error on missing values or invalid id', () =>
      validateAnswer({ bogusKey: -1, answer: 'oh' })
      .then(() => Promise.reject(new Error('Missing \'questionId\' key')))
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
        return validateAnswer({ questionId: 3 });
      })
      .then(() => Promise.reject(new Error('Missing \'answer\' key')))
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
        return validateAnswer({ questionId: 0, answer: '' });
      })
      .then(() => Promise.reject(new Error('Invalid \'questionId\' key')))
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
      })
    );
  });

  describe('on invalid answers', () => {
    it('should reject with error if given question ID does not exist', () =>
      validateAnswer({ questionId: 666, answer: 'welp' })
      .then(() => Promise.reject(new Error('No such question ID')))
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
      })
    );

    it('should reject with error on invalid answer type for radio', () =>
      validateAnswer({ questionId: 2, answer: 'not an integer' })
      .then(() => Promise.reject(new Error('String was validated as Number')))
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
      })
    );

    it('should reject with error on invalid answer type for checkbox', () =>
      validateAnswer({ questionId: 1, answer: [3, null, 54] })
      .then(() => Promise.reject(new Error('Array containing null was validated as Array of Numbers')))
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
      })
    );

    it('should reject with error on invalid answer type for fillblank', () =>
      validateAnswer({ questionId: 40, answer: [1, 'nr2'] })
      .then(() => Promise.reject(new Error('Array containing a Number was validated as Array of Strings')))
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
      })
    );

    it('should reject with error on invalid answer type for textarea', () =>
      validateAnswer({ questionId: 11, answer: {} })
      .then(() => Promise.reject(new Error('Object was validated as String')))
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
      })
    );
  });
});

describe('#verifyAnswer()', () => {
  const verifyAnswer = util.verifyAnswer(questions);

  function runVerificationTest(falseAnswer, trueAnswer) {
    return () => verifyAnswer(falseAnswer)
    .then((verified) => {
      expect(verified).toEqual({ ...falseAnswer, isCorrect: false });
      return verifyAnswer(trueAnswer);
    })
    .then((verified) => {
      expect(verified).toEqual({ ...trueAnswer, isCorrect: true });
    });
  }

  it('should resolve with verified answer for radio',
    runVerificationTest({ questionId: 2, answer: 5 }, { questionId: 2, answer: 6 })
  );

  it('should resolve with verified answer for checkbox',
    runVerificationTest({ questionId: 1, answer: [1, 2, 3] }, { questionId: 1, answer: [3, 1] })
  );

  it('should resolve with verified answer for fillblank',
    runVerificationTest(
      { questionId: 40, answer: ['yes', 'no'] }, { questionId: 40, answer: ['yes', 'yes twice', '30'] })
  );

  it('should resolve with verified answer for textarea', () => {
    const answer = { questionId: 11, answer: 'some random text' };

    return verifyAnswer(answer)
    .then((verified) => {
      expect(verified).toEqual({ ...answer, isCorrect: null });
    });
  });
});
