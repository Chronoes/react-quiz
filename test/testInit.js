import database, {Quiz, User, Question} from '../server/database';

function saveTextAnswer(transaction, user) {
  return (relationId) => (values) =>
    user.createUserTextAnswer(values, {transaction})
    .then((textAnswer) => textAnswer.setQuestion(relationId, {transaction}));
}

function saveChoiceAnswer(transaction, user) {
  return (values) => (relationId) =>
    user.createUserChoiceAnswer(values, {transaction})
    .then((choiceAnswer) => choiceAnswer.setQuestionChoice(relationId, {transaction}));
}


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
  .then(() => Quiz.create(
    {
      title: 'a testing quiz',
      timeLimit: 30 * 60,
      questions: [
        {id: 100, type: 'radio', question: 'a nice title', questionChoices: [
          {id: 100, value: 'impossible', isAnswer: false},
          {id: 101, value: 'improbable', isAnswer: true},
          {id: 102, value: 'inexplicable', isAnswer: false},
        ]},
        {id: 101, type: 'checkbox', question: 'some other title', questionChoices: [
          {id: 103, value: 'irrevocable', isAnswer: false},
          {id: 104, value: 'illogical', isAnswer: true},
          {id: 105, value: 'insurmountable', isAnswer: true},
          {id: 106, value: 'illegal', isAnswer: false},
        ]},
        {id: 102, type: 'fillblank', question: 'irrelevant', questionChoices: [
          {value: 'correct answer', isAnswer: true},
        ]},
        {id: 103, type: 'textarea', question: 'lorem ipsum', questionChoices: []},
      ],
    }, {include: [Question.scope('withChoices')]}))
    .then((quiz) => quiz.createUser({name: 'random name', hash: 'testhash'})
      .then(() => User.findOne({where: {id: 2}}))
      .then((user) => database.transaction((transaction) => {
        const textAnswer = saveTextAnswer(transaction, user);
        const choiceAnswer = saveChoiceAnswer(transaction, user);
        return Promise.all([
          choiceAnswer({isCorrect: true})(101),
          choiceAnswer({isCorrect: false})(103),
          choiceAnswer({isCorrect: false})(105),
          choiceAnswer({isCorrect: false})(106),
          textAnswer(102)({value: 'correct answer', isCorrect: true}),
          textAnswer(103)({value: 'some random stuff', isCorrect: null}),
        ]);
      })))
  .then(() => done())
  .catch(done);
});
