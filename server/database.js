import Sequelize from 'sequelize';

import conf from './conf';
import models from './models/index';

const { name, user, password, dialect, host } = conf.getIn([process.env.NODE_ENV, 'database']);

const database = new Sequelize(name, user, password, {
  dialect,
  host,
  logging: false,
  pool: {
    max: 100,
    min: 0,
    idle: 10000,
  },
});

export const QuestionChoice = database.define('questionChoice', models.QuestionChoice.attributes, {
  timestamps: false,
});

export const Question = database.define('question', models.Question.attributes, {
  timestamps: false,
  defaultScope: {
    order: [['order']],
  },
  scopes: {
    withChoices: {
      include: [QuestionChoice],
    },
  },
});

Question.hasMany(QuestionChoice);
QuestionChoice.belongsTo(Question);

export const Quiz = database.define('quiz', models.Quiz.attributes, {
  scopes: {
    active: {
      where: { status: 1 },
    },
    user: {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
    withQuestions: {
      include: [Question.scope('withChoices')],
    },
  },
});
Quiz.mappings = models.Quiz.mappings;

Quiz.hasMany(Question);
Question.belongsTo(Quiz);

export const UserTextAnswer = database.define('userTextAnswer', models.UserTextAnswer.attributes, {
  timestamps: false,
});

export const UserChoiceAnswer = database.define('userChoiceAnswer', models.UserChoiceAnswer.attributes, {
  timestamps: false,
});

export const User = database.define('user', models.User.attributes, {
  updatedAt: false,
  scopes: {
    withAnswers: {
      include: [
        { model: UserTextAnswer, attributes: ['isCorrect', 'questionId', 'value'] },
        { model: UserChoiceAnswer, attributes: ['isCorrect', 'questionChoiceId'],
          include: [{ model: QuestionChoice, attributes: ['questionId'] }] },
      ],
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
