import Sequelize from 'sequelize';

import conf from './conf';
import models, {constants} from './models/index';

const {name, user, password, dialect, logging, host} = conf.getIn([process.env.NODE_ENV, 'database']);

const database = new Sequelize(name, user, password, {
  dialect,
  host,
  logging,
  pool: {
    max: 100,
    min: 0,
    idle: 10000,
  },
});

export const QuestionChoice = database.define('question_choice', models.QuestionChoice, {
  timestamps: false,
});

export const Question = database.define('question', models.Question, {
  scopes: {
    withChoices: {
      include: [QuestionChoice],
    },
  },
  timestamps: false,
});

export const Quiz = database.define('quiz', models.Quiz, {
  scopes: {
    active: {
      where: {status: constants.QUIZ_STATUS_ACTIVE},
    },
    user: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'status'],
      },
    },
    withQuestions: {
      include: [Question.scope('withChoices')],
    },
  },
});

Quiz.hasMany(Question);

Question.hasMany(QuestionChoice);

export const UserTextAnswer = database.define('user_text_answer', models.UserTextAnswer, {
  timestamps: false,
});

export const UserChoiceAnswer = database.define('user_choice_answer', models.UserChoiceAnswer, {
  timestamps: false,
});

export const User = database.define('user', models.User);

Quiz.hasMany(User);
User.belongsTo(Quiz);

User.hasMany(UserChoiceAnswer);
UserChoiceAnswer.belongsTo(QuestionChoice);

User.hasMany(UserTextAnswer);
UserTextAnswer.belongsTo(Question);

export {constants};

export default database;
