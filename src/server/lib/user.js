import { User } from '../database';
import { genChecksum } from '../lib/general';

export function createUser(username, quizId) {
  return User.query()
  .insert({ username, quiz_id: quizId }, 'user_id')
  .then(([userId]) => User.query('U')
    .first('U.user_id AS userId', 'U.created_at AS createdAt')
    .where('U.user_id', userId))
  .then(({ userId, createdAt }) => {
    const hash = genChecksum({ id: userId, createdAt });
    return User.query()
    .update('hash', hash)
    .then(() => Promise.resolve({ userId, hash }));
  });
}
