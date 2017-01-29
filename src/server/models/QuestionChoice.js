export default (table) => {
  table.increments('question_choice_id').primary();
  table.text('value').notNullable();
  table.boolean('isAnswer');
  return table;
};
