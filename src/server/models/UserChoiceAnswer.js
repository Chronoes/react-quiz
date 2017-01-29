export default (table) => {
  table.increments('user_choice_answer_id').primary();
  table.boolean('is_correct');
  return table;
};
