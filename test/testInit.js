import database from '../server/database';

before((done) => {
  database.sync({force: true})
  .then(() => done())
  .catch((err) => done(err));
});
