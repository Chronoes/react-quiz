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

export const Quiz = database.define('quiz', models.Quiz, {
  scopes: {
    active: {
      where: {status: constants.QUIZ_STATUS_ACTIVE},
    },
  },
});

export const Question = database.define('question', models.Question);
Quiz.hasMany(Question);

export const QuestionChoice = database.define('question_choice', models.QuestionChoice);
Question.hasMany(QuestionChoice);

export const User = database.define('user', models.User);

export const UserChoiceAnswer = database.define('user_choice_answer', models.UserChoiceAnswer);
User.hasMany(UserChoiceAnswer);
UserChoiceAnswer.belongsTo(QuestionChoice);

export const UserTextAnswer = database.define('user_text_answer', models.UserTextAnswer);
User.hasMany(UserTextAnswer);
UserTextAnswer.belongsTo(Question);

export {constants};

export default database;
