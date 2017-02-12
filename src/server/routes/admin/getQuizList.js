import database, { Quiz, User } from '../../database';
import { parseNumberDefault } from '../../lib/general';
import logger from '../../logger';

// Sequelize has issues counting associations, so I do a raw query
function findAllAndCountAssociation(limit, offset) {
  return database.query(`
    SELECT
      "${Quiz.name}".*,
      COUNT("${User.name}"."id") AS "users"
    FROM
      "${Quiz.tableName}" AS "${Quiz.name}"
      LEFT OUTER JOIN "${User.tableName}" AS "${User.name}" ON ("${User.name}"."${Quiz.name}Id" = "${Quiz.name}"."id")
    GROUP BY
      "${Quiz.name}"."id"
    ORDER BY
      "${Quiz.name}"."updatedAt" DESC
    LIMIT :limit OFFSET :offset
    `, {
      type: database.QueryTypes.SELECT,
      replacements: { limit, offset },
      model: Quiz,
    });
}

export default (req, res) => {
  const limit = parseNumberDefault(req.query.limit, 18);
  const offset = parseNumberDefault(req.query.offset, 0);
  return findAllAndCountAssociation(limit, offset)
  .then((quizzes) => res.json(quizzes))
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
};
