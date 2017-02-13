import Knex from 'knex';

import conf from './conf';
import models from './models';

const { name, user, password, dialect, host } = conf.getIn([process.env.NODE_ENV, 'database']);

const database = new Knex({
  client: dialect,
  connection: {
    host,
    user,
    password,
    database: name,
  },
});

export function createSchema() {
  const initOrder = models.initOrder.slice();
  const first = models[initOrder.shift()];
  return initOrder
  .reduce((promise, next) =>
    promise.then(() => database.schema.createTableIfNotExists(models[next].name, models[next].definition)),
    database.schema.createTableIfNotExists(first.name, first.definition));
}

export function dropSchema() {
  const dropOrder = models.initOrder.slice();
  dropOrder.reverse();
  const first = models[dropOrder.shift()];
  return dropOrder
  .reduce((promise, next) =>
    promise.then(() => database.schema.dropTableIfExists(models[next].name)),
    database.schema.dropTableIfExists(first.name));
}

class Model {
  constructor({ name: modelName, mappings }) {
    this.name = modelName;
    this.mappings = mappings;
  }

  query(tableAlias) {
    return tableAlias ? database(`${this.name} AS ${tableAlias}`) : database(this.name);
  }

  toString() {
    return this.name;
  }
}

export const Quiz = new Model(models.Quiz);

export const Question = new Model(models.Question);

export const QuestionChoice = new Model(models.QuestionChoice);

export const User = new Model(models.User);

export const UserTextAnswer = new Model(models.UserTextAnswer);

export const UserChoiceAnswer = new Model(models.UserChoiceAnswer);

export default database;
