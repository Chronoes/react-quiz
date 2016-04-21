import { STRING, BOOLEAN } from 'sequelize';

/* eslint new-cap: 0 */
export default {
  username: {
    type: STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  password: {
    type: STRING(50),
    allowNull: false,
  },

  isAdmin: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};
