import React, {PropTypes as Types} from 'react';

import QuizForm from './QuizForm';
import QuizQuestionEditControls from './QuizQuestionEditControls';

class AdminQuizForm extends QuizForm {
  static displayName = 'AdminQuizForm';
  static propTypes = {
    ...QuizForm.propTypes,
    actions: Types.shape({
      deleteQuestion: Types.func,
    }).isRequired,
  };

  componentDidUpdate() {}

  onSubmitForm(event) {
    event.preventDefault();
  }

  makeQuizElement(question, key, disabled) {
    const {deleteQuestion} = this.props.actions;
    return (
      <QuizQuestionEditControls key={key} id={key} delete={deleteQuestion} move>
        {super.makeQuizElement(question, key, disabled)}
      </QuizQuestionEditControls>
    );
  }
}

export default AdminQuizForm;
