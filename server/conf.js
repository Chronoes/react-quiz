import path from 'path';
import {Map} from 'immutable';

const base = new Map({
  database: new Map({
    dialect: 'postgres',
    host: 'localhost',
    name: 'quiz_dev',
    user: 'vesikonna',
    logging: false,
    password: '',
  }),
});

const development = new Map(base);

const testing = base.setIn(['database', 'name'], 'quiz_test');

const production = base.setIn(['database', 'name'], 'quiz');

export default new Map({development, testing, production,
  secretPath: path.join(__dirname, 'secret'),
});
