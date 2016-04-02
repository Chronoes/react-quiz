import {STRING} from 'sequelize';

/* eslint new-cap: 0 */
export default {
  type: {
    type: STRING(50),
    allowNull: false,
    validate: {
      isIn: [['checkbox', 'radio', 'fillblank', 'textarea']],
    },
  },

  question: {
    type: STRING,
    allowNull: false,
    notEmpty: true,
  },
};
