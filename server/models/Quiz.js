import {STRING, INTEGER} from 'sequelize';

export const QUIZ_STATUS_PASSIVE = 0;
export const QUIZ_STATUS_ACTIVE = 1;

export default {
  status: {
    type: INTEGER,
    allowNull: false,
    defaultValue: QUIZ_STATUS_ACTIVE,
    validate: {
      isIn: [QUIZ_STATUS_ACTIVE, QUIZ_STATUS_PASSIVE],
    },
  },

  title: {
    type: STRING,
    allowNull: false,
    notEmpty: true,
  },

  timeLimit: INTEGER,
};
