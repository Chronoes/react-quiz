import moment from 'moment';

/* eslint no-console: 0 */
export function getQuizRequest(name) {
  if (!name) {
    console.log(`getQuizRequest: ${typeof name}`);
    return Promise.reject({ message: 'Problem with parameters' });
  }
  return Promise.resolve({ data: {
    id: 1,
    title: 'ayyy lmao',
    userHash: '0123456789abcdef',
    questions: [
      {
        id: 1,
        type: 'radio',
        question: 'Question 1',
        choices: [
          { id: 1, value: 'One answer' },
          { id: 2, value: 'Two answer' },
          { id: 3, value: 'Three answer' },
          { id: 4, value: 'Ha- Ha- Ha-' },
        ],
      },
      {
        id: 2,
        type: 'checkbox',
        question: 'Question 1',
        choices: [
          { id: 5, value: 'Interesting' },
          { id: 6, value: 'Boring' },
          { id: 7, value: 'Compelling' },
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
  } });
}

export function sendResultsRequest(payload) {
  if (typeof payload !== 'object') {
    return Promise.reject({ message: 'Payload is of wrong type' });
  }
  return Promise.resolve({ data: { correctAnswers: 2 } });
}

export function saveQuizRequest(payload) {
  if (typeof payload !== 'object') {
    return Promise.reject({ message: 'Payload is of wrong type' });
  }
  return Promise.resolve({ data: {
    id: 8,
    title: payload.title,
    questions: payload.questions.map(
      ({ type, question, choices }, i) => ({
        id: i + 1,
        type,
        question,
        choices: choices.map((value, j) => ({ id: j + 1, value })),
      })),
  } });
}

export function getQuizListRequest() {
  return Promise.resolve({ data: [
    {
      id: 1,
      title: 'ayyy lmao',
      createdAt: '2016-05-30T00:00:00Z',
      updatedAt: moment().subtract(8, 'days'),
      users: parseInt(Math.random() * 50, 10),
      status: 'passive',
    },
    {
      id: 2,
      title: 'this be 2nd matte',
      createdAt: moment().subtract(5, 'days'),
      updatedAt: moment(),
      users: parseInt(Math.random() * 50, 10),
      status: 'active',
    },
    {
      id: 3,
      title: '<3',
      createdAt: moment().subtract(2, 'days'),
      updatedAt: moment().subtract(1, 'days'),
      users: parseInt(Math.random() * 50, 10),
      status: 'passive',
    },
    {
      id: 4,
      title: '4?',
      createdAt: moment(),
      updatedAt: moment(),
      users: parseInt(Math.random() * 50, 10),
      status: 'passive',
    },
  ] });
}

export function getQuizByIdRequest(id) {
  if (parseInt(id, 10) <= 0) {
    return Promise.reject(`Parameter '${id}' is not positive integer or NaN.`);
  }
  return Promise.resolve({ data: {
    id: 1,
    title: 'ayyy lmao',
    status: 'passive',
    questions: [
      {
        id: 1,
        type: 'radio',
        question: 'Question 1',
        choices: [
          { id: 1, value: 'One answer', isAnswer: true },
          { id: 2, value: 'Two answer', isAnswer: false },
          { id: 3, value: 'Three answer', isAnswer: false },
          { id: 4, value: 'Ha- Ha- Ha-', isAnswer: false },
        ],
      },
      {
        id: 2,
        type: 'checkbox',
        question: 'Question 1',
        choices: [
          { id: 5, value: 'Interesting', isAnswer: true },
          { id: 6, value: 'Boring', isAnswer: true },
          { id: 7, value: 'Compelling', isAnswer: false },
        ],
      },
      {
        id: 3,
        type: 'fillblank',
        question: 'What does the cat say? ___.\nWhat does the dog say? ___.',
        choices: [
          { id: 8, value: 'woof', isAnswer: true },
          { id: 9, value: 'meow', isAnswer: true },
        ],
      },
      {
        id: 4,
        type: 'textarea',
        question: 'Riddle me this: I\'m spent...',
      },
    ],
    timeLimit: 900,
  } });
}

export function updateStatusRequest(quizId, newStatus) {
  return Promise.resolve({
    id: quizId,
    title: 'ayyy lmao',
    createdAt: '2016-05-30T00:00:00Z',
    updatedAt: moment(),
    users: parseInt(Math.random() * 50, 10),
    status: newStatus,
  });
}
