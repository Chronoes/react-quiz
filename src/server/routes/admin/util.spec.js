import { Request, Response } from '../../../../__mocks__/express';
import * as util from './util';

describe('#validateQuiz()', () => {
  it('should resolve on correct data', () => {
    const quiz = {
      title: 'Cool stuff',
      status: 'active',
      timeLimit: 93,
      questions: [],
    };

    const next = jest.fn(() => {});
    const req = new Request().setBody(quiz);

    return util.validateQuiz(req, new Response(), next)
    .then(() => {
      expect(next).toHaveBeenCalled();
      expect(req.validatedQuiz).toEqual(quiz);
    });
  });


  function onRejection(quiz) {
    const req = new Request().setBody(quiz);
    const res = new Response();
    const next = jest.fn(() => {});

    return util.validateQuiz(req, res, next)
    .then(() => {
      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });
  }

  it('should reject on invalid title', () =>
    onRejection({
      title: '',
      status: 'active',
      timeLimit: 93,
      questions: [],
    })
  );

  it('should reject on invalid status', () =>
    onRejection({
      title: 'Correct title',
      status: 'impossible',
      timeLimit: 122,
      questions: [],
    })
  );

  it('should reject on invalid timeLimit', () =>
    onRejection({
      title: 'Correct title',
      status: 'passive',
      timeLimit: 0,
      questions: [],
    })
  );

  it('should reject on invalid questions', () =>
    onRejection({
      title: 'Correct title',
      status: 'passive',
      timeLimit: 122,
    })
  );
});


describe('#fetchQuiz()', () => {
  it('should do stuff', () => {
    expect(true).toBe(false);
  });
});
