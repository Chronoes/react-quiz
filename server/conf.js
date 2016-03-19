import path from 'path';

const base = {
  database: {
    dialect: 'postgres',
    host: 'localhost',
    name: 'quiz_dev',
    user: 'vesikonna',
    logging: false,
    password: '',
  },
};

const development = {...base};

const testing = {...base,
  database: {
    ...base.database,
    name: 'quiz_test',
  },
};

const production = {...base,
  database: {
    ...base.database,
    name: 'quiz',
  },
};

export default {development, testing, production,
  secretPath: path.join(__dirname, 'secret'),
};
