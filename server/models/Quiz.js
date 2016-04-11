import { STRING, INTEGER } from 'sequelize';

/* eslint new-cap: 0 */
export default {
  status: {
    type: STRING(20),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'passive']],
    },
  },

  title: {
    type: STRING,
    allowNull: false,
    notEmpty: true,
  },

  timeLimit: INTEGER,
};
