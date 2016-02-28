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
    }).isRequired,
  };

  componentDidUpdate() {}

  onSubmitForm(event) {
    event.preventDefault();
  }

  makeQuizElement(question, key, disabled) {
    const {deleteQuestion, editQuestion} = this.props.actions;
    return (
      <QuestionEditControls key={key} id={key} delete={deleteQuestion} edit={editQuestion} move>
        {super.makeQuizElement(question, key, disabled)}
      </QuestionEditControls>
    );
  }
}

export default AdminQuizForm;
