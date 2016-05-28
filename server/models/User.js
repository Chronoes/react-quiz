import { STRING, INTEGER, BOOLEAN } from 'sequelize';

/* eslint new-cap: 0 */
export default {
  username: {
    type: STRING,
    allowNull: false,
  },

  password: {
    type: STRING(50),
  },

  isAdmin: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  timeSpent: INTEGER,

  hash: STRING(40),
};
