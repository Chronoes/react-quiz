import {STRING, INTEGER} from 'sequelize';

export default {
  username: {
    type: STRING,
  },

  password: {
    type: STRING,
  },

  name: {
    type: STRING,
    allowNull: false,
  },

  timeSpent: INTEGER,
};
