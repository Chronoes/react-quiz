import { STRING, INTEGER, ValidationError } from 'sequelize';
import { Map } from 'immutable';

export const statuses = new Map({ passive: 0, active: 1 });
/* eslint new-cap: 0 */
export default {
  status: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1,
    get() {
      return statuses.keyOf(this.getDataValue('status'));
    },
    set(status) {
      if (!statuses.includes(status)) {
        throw new ValidationError(`Status must be one of [${statuses.valueSeq().toArray()}]`);
      }
      return this.setDataValue('status', status);
    },
  },

  title: {
    type: STRING,
    allowNull: false,
    notEmpty: true,
  },

  timeLimit: INTEGER,
};
