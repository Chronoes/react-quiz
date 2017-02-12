import { Map } from 'immutable';

export const types = new Map({ radio: 1, checkbox: 2, fillblank: 3, textarea: 4 });

export default (table) => {
  table.increments('question_id').primary();
  table.specificType('type', 'smallint').notNullable();
  table.string('question').notNullable();
  table.specificType('order_by', 'smallint').notNullable();
  return table;
};
