export default (table) => {
  table.increments('user_text_answer_id').primary();
  table.text('value').notNullable();
  table.boolean('is_correct');
  return table;
};
