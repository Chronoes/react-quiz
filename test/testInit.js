import database, {Quiz} from '../server/database';

before((done) => {
  database.sync({force: true})
  .then(() => Quiz.bulkCreate([
    {
      title: 'testing quiz1',
      timeLimit: 15 * 60,
    },
    {
      title: 'testing quiz2',
      timeLimit: 25 * 60,
    },
  ]))
  .then(() => done())
  .catch(done);
});
