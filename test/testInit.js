import database from '../server/database';

before((done) => {
  database.sync()
  .then(() => done())
  .catch(done);
});

after((done) => {
  database.truncate({cascade: true})
  .then(() => done())
  .catch(done);
});
