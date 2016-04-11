import { TEXT, BOOLEAN } from 'sequelize';

export default {
  value: {
    type: TEXT,
    allowNull: false,
  },

  isAnswer: BOOLEAN,
};
