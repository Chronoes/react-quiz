import moment from 'moment';

export function getQuizRequest(name) {
  if (!name) {
    console.log(`getQuizRequest: ${typeof name}`);
    return Promise.reject({message: 'Problem with parameters'});
  }
  return Promise.resolve({data: {
    id: 1,
    title: 'ayyy lmao',
    userId: 1,
    questions: [
      {
        id: 1,
        type: 'radio',
        question: 'Question 1',
        choices: [
          {id: 1, value: 'One answer'},
          {id: 2, value: 'Two answer'},
          {id: 3, value: 'Three answer'},
          {id: 4, value: 'Ha- Ha- Ha-'},
        ],
      },
      {
        id: 2,
        type: 'checkbox',
        question: 'Question 1',
        choices: [
          {id: 5, value: 'Interesting'},
          {id: 6, value: 'Boring'},
          {id: 7, value: 'Compelling'},
        ],
      },
      {
        id: 3,
        type: 'fillblank',
        question: 'What does the cat say? ___.\nWhat does the dog say? ___.',
      },
      {
        id: 4,
        type: 'textarea',
        question: 'Riddle me this: I\'m spent...',
      },
    ],
    timeLimit: 900,
  }});
}

export function sendResultsRequest(payload) {
  if (typeof payload !== 'object') {
    return Promise.reject({message: 'Payload is of wrong type'});
  }
  return Promise.resolve({data: {correctAnswers: 2}});
}

export function getQuizListRequest() {
  return Promise.resolve({data: [
    {
      id: 1,
      title: 'ayyy lmao',
      createdAt: moment().subtract(8, 'days'),
      updatedAt: moment().subtract(8, 'days'),
      users: parseInt(Math.random() * 50, 10),
      isActive: false,
    },
    {
      id: 2,
      title: 'this be 2nd matte',
      createdAt: moment().subtract(5, 'days'),
      updatedAt: moment(),
      users: parseInt(Math.random() * 50, 10),
      isActive: true,
    },
    {
      id: 3,
      title: '<3',
      createdAt: moment().subtract(2, 'days'),
      updatedAt: moment().subtract(1, 'days'),
      users: parseInt(Math.random() * 50, 10),
      isActive: false,
    },
    {
      id: 4,
      title: '4?',
      createdAt: moment(),
      updatedAt: moment(),
      users: parseInt(Math.random() * 50, 10),
      isActive: false,
    },
  ]});
}
