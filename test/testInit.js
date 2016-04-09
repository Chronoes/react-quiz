import database, {Quiz, User} from '../server/database';

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
  .then(() => Quiz.findById(1))
  .then((quiz) => User.bulkCreate([
    {
      name: 'user1',
      timeSpent: 333,
    },
    {
      name: 'user2',
      timeSpent: 420,
    },
    {
      name: 'user3',
      timeSpent: 800,
    },
  ])
  .then(() => User.findAll())
  .then((users) => quiz.setUsers(users)))
  .then(() => done())
  .catch(done);
});
