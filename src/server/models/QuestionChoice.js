export default (table) => {
  table.increments('question_choice_id').primary();
  table.text('value').notNullable();
  table.boolean('is_answer').notNullable();
  return table;
};
