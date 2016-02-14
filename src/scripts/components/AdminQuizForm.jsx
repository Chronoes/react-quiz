import React, {PropTypes as Types} from 'react';

import QuizForm from './QuizForm';
import QuizQuestionEditControls from './QuizQuestionEditControls';

class AdminQuizForm extends QuizForm {
  static displayName = 'AdminQuizForm';
  static propTypes = {...QuizForm.propTypes,
    actions: Types.shape({
      deleteQuestion: Types.func,
    }).isRequired,
  };

  componentDidUpdate() {}

  makeQuizElement(question, key) {
    const {deleteQuestion} = this.props.actions;
    return (
      <QuizQuestionEditControls key={key} id={key} delete={deleteQuestion} move>
        {super.makeQuizElement(question, key)}
      </QuizQuestionEditControls>
    );
  }

  render() {
    const {quiz} = this.props;
    const questions = quiz.get('questions');
    return (
      <div className="form-container">
        <QuizQuestionEditControls textOnly>
          <h1>{quiz.get('title')}</h1>
        </QuizQuestionEditControls>
        <div>
          {questions.map(this.makeQuizElement)}
          <button className="btn btn-primary" disabled>Saada</button>
        </div>
      </div>
    );
  }
}

export default AdminQuizForm;
