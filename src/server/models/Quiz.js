import { Map } from 'immutable';

export const statuses = new Map({ passive: 0, active: 1 });

export default (table) => {
  table.increments('quiz_id').primary();
  table.integer('status').notNullable().defaultsTo(statuses.get('active'));
  table.string('title').notNullable();
  table.integer('time_limit');
  table.timestamps(true, true);
  return table;
};
