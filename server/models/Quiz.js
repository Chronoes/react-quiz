import {STRING, INTEGER} from 'sequelize';
import {Map} from 'immutable';

export const QUIZ_STATUS_PASSIVE = 0;
export const QUIZ_STATUS_ACTIVE = 1;

const mapping = new Map({[QUIZ_STATUS_ACTIVE]: 'active', [QUIZ_STATUS_PASSIVE]: 'passive'});

export default {
  status: {
    type: INTEGER,
    allowNull: false,
    defaultValue: QUIZ_STATUS_ACTIVE,
    validate: {
      isIn: [mapping.keySeq().toArray()],
    },
    get() { return mapping.get(`${this.getDataValue('status')}`); },
    set(value) { this.setDataValue('status', parseInt(mapping.findEntry((v) => v === value)[0], 10)); },
  },

  title: {
    type: STRING,
    allowNull: false,
    notEmpty: true,
  },

  timeLimit: INTEGER,
};
