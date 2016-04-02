import Sequelize from 'sequelize';

import conf from './conf';
import models from './models/index';

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

export const QuestionChoice = database.define('questionChoice', models.QuestionChoice, {
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
      where: {status: 'active'},
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

export const UserTextAnswer = database.define('userTextAnswer', models.UserTextAnswer, {
  timestamps: false,
});

export const UserChoiceAnswer = database.define('userChoiceAnswer', models.UserChoiceAnswer, {
  timestamps: false,
});

export const User = database.define('user', models.User, {
  scopes: {
    withAnswers: {
      include: [UserTextAnswer, UserChoiceAnswer],
    },
  },
});

Quiz.hasMany(User);
User.belongsTo(Quiz);

User.hasMany(UserChoiceAnswer);
UserChoiceAnswer.belongsTo(User);
UserChoiceAnswer.belongsTo(QuestionChoice);

User.hasMany(UserTextAnswer);
UserTextAnswer.belongsTo(User);
UserTextAnswer.belongsTo(Question);

export default database;
