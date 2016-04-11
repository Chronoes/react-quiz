import { STRING, INTEGER } from 'sequelize';

/* eslint new-cap: 0 */
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

  hash: STRING(40),
};
