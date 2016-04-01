import {expect} from 'chai';
import * as util from '../server/routes/quiz/utilQuiz';

describe('Quiz utility functions', () => {
  describe('#mapQuestionsById()', () => {
    it('should return a map of ids -> data from questions as queried from database', () => {
      const questions = [
        {
          id: 1,
          question: 'is it ok?',
          question_choices: [
            {id: 1, isAnswer: true, value: 'yes'},
            {id: 2, isAnswer: false, value: 'maybe'},
            {id: 3, isAnswer: false, value: 'no'},
          ],
        },
        {
          id: 2,
          question: 'maybe it is now?',
          question_choices: [
            {id: 5, isAnswer: false, value: 'yes'},
            {id: 6, isAnswer: true, value: 'maybe'},
          ],
        },
        {
          id: 40,
          question: 'oh dear',
          question_choices: [
            {id: 10, isAnswer: true, value: 'yes'},
          ],
        },
      ];

      const expected = {
        1: {
          question: 'is it ok?',
          choices: {
            1: {isAnswer: true, value: 'yes'},
            2: {isAnswer: false, value: 'maybe'},
            3: {isAnswer: false, value: 'no'},
          },
        },
        2: {
          question: 'maybe it is now?',
          choices: {
            5: {isAnswer: false, value: 'yes'},
            6: {isAnswer: true, value: 'maybe'},
          },
        },
        40: {
          question: 'oh dear',
          choices: {
            10: {isAnswer: true, value: 'yes'},
          },
        },
      };

      expect(util.mapQuestionsById(questions)).to.deep.equal(expected);
    });
  });

  describe('#validateAnswer()', () => {
    context('on valid answers', () => {
      it('should resolve with correctly parsed answers for radio');

      it('should resolve with correctly parsed answers for checkbox');

      it('should resolve with correctly parsed answers for fillblank');

      it('should resolve with correctly parsed answers for textarea');
    });

    context('on invalid answer format', () => {
      it('should reject with ValidationError on non-object answer');

      it('should reject with ValidationError on invalid values');
    });

    context('on invalid answers', () => {
      it('should reject with ValidationError if given question ID does not exist');

      it('should reject with ValidationError on invalid answer type for radio');

      it('should reject with ValidationError on invalid answer type for checkbox');

      it('should reject with ValidationError on invalid answer type for fillblank');

      it('should reject with ValidationError on invalid answer type for textarea');

      it('should reject with ValidationError on invalid question type');
    });
  });

  describe('#verifyAnswer()', () => {
    it('should resolve with verified answer for radio');

    it('should resolve with verified answer for checkbox');

    it('should resolve with verified answer for fillblank');

    it('should resolve with verified answer for textarea');

    it('should reject with ValidationError on invalid question type');
  });
});
