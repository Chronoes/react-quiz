import React, {PropTypes as Types} from 'react';

import QuizForm from './QuizForm';
import QuestionEditControls from './QuestionEditControls';

class AdminQuizForm extends QuizForm {
  static displayName = 'AdminQuizForm';
  static propTypes = {
    ...QuizForm.propTypes,
    actions: Types.shape({
      deleteQuestion: Types.func,
      editQuestion: Types.func,
      moveQuestion: Types.func,
    }).isRequired,
  };

  componentDidUpdate() {}

  onSubmitForm(event) {
    event.preventDefault();
  }

  makeQuizElement(question, key, disabled) {
    const {quiz: {questions}, actions: {deleteQuestion, editQuestion, moveQuestion}} = this.props;
    return (
      <QuestionEditControls
        key={key}
        id={key}
        delete={deleteQuestion}
        edit={editQuestion}
        move={moveQuestion}
        first={key === 0}
        last={key === questions.size - 1}>
        {super.makeQuizElement(question, key, disabled)}
      </QuestionEditControls>
    );
  }
}

export default AdminQuizForm;
