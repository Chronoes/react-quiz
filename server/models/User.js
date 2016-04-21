import { STRING, INTEGER } from 'sequelize';

/* eslint new-cap: 0 */
export default {
  name: {
    type: STRING,
    allowNull: false,
  },

  timeSpent: INTEGER,

  hash: STRING(40),
};
