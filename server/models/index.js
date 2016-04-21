import Quiz, { statuses } from './Quiz';
import Question from './Question';
import QuestionChoice from './QuestionChoice';

import User from './User';
import UserTextAnswer from './UserTextAnswer';
import UserChoiceAnswer from './UserChoiceAnswer';

import RegisteredUser from './RegisteredUser';

export default {
  Quiz: {
    attributes: Quiz,
    mappings: { statuses },
  },
  Question: {
    attributes: Question,
  },
  QuestionChoice: {
    attributes: QuestionChoice,
  },
  User: {
    attributes: User,
  },
  UserTextAnswer: {
    attributes: UserTextAnswer,
  },
  UserChoiceAnswer: {
    attributes: UserChoiceAnswer,
  },
  RegisteredUser: {
    attributes: RegisteredUser,
  },
};
