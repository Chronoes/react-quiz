import quiz, { statuses } from './Quiz';
import question, { types as questionTypes } from './Question';
import questionChoice from './QuestionChoice';

import user from './User';
import userTextAnswer from './UserTextAnswer';
import userChoiceAnswer from './UserChoiceAnswer';

export default {
  initOrder: ['Quiz', 'Question', 'QuestionChoice', 'User', 'UserTextAnswer', 'UserChoiceAnswer'],
  Quiz: {
    name: 'quizzes',
    mappings: { statuses },
    definition: quiz,
  },
  Question: {
    name: 'questions',
    mappings: { questionTypes },
    definition(table) {
      question(table);
      table.integer('quiz_id').notNullable().references('quiz_id').inTable('quizzes');
    },
  },
  QuestionChoice: {
    name: 'question_choices',
    definition(table) {
      questionChoice(table);
      table.integer('question_id').notNullable().references('question_id').inTable('questions');
    },
  },
  User: {
    name: 'users',
    definition: user,
  },
  UserTextAnswer: {
    name: 'user_text_answers',
    definition(table) {
      userTextAnswer(table);
      table.integer('user_id').notNullable().references('user_id').inTable('users');
      table.integer('question_id').notNullable().references('question_id').inTable('questions');
    },
  },
  UserChoiceAnswer: {
    name: 'user_choice_answers',
    definition(table) {
      userChoiceAnswer(table);
      table.integer('user_id').notNullable().references('user_id').inTable('users');
      table.integer('question_choice_id').notNullable().references('question_choice_id').inTable('question_choices');
    },
  },
};
