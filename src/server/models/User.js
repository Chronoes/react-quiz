export default (table) => {
  table.increments('user_id').primary();
  table.string('username').notNullable();
  table.string('password', 50);
  table.boolean('is_admin').notNullable().defaultsTo(false);
  table.integer('time_spent');
  table.string('hash', 40);
  table.timestamps(true, true);
  return table;
};
