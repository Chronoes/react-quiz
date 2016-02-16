import React, {Component, PropTypes as Types} from 'react';
import {Map} from 'immutable';

import MultiInputGroup from './MultiInputGroup';
import Radio from './Radio';
import Checkbox from './Checkbox';
import TextArea from './TextArea';
import FillBlankGroup from './FillBlankGroup';

class QuizForm extends Component {
  static propTypes = {
    actions: Types.shape({
      sendResults: Types.func,
      finishQuiz: Types.func,
      setAnswer: Types.func,
      setCheckboxAnswer: Types.func,
      setFillblankAnswer: Types.func,
    }).isRequired,
    quiz: Types.instanceOf(Map).isRequired,
  };

  constructor(props) {
    super(props);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.makeQuizElement = this.makeQuizElement.bind(this);
  }

  componentDidUpdate() {
    const {quiz} = this.props;
    const {resultsSent, isRunning, timeSpent} = quiz;
    if (!resultsSent && !isRunning && timeSpent > 0) {
      this.props.actions.sendResults(quiz);
    }
  }

  onSubmitForm(event) {
    event.preventDefault();
    this.props.actions.finishQuiz();
  }

  makeQuizElement({type, question, choices}, key, disabled) {
    const {actions: {setAnswer, setCheckboxAnswer, setFillblankAnswer}} = this.props;
    const defaultProps = {key, questionId: key, disabled, question, Title: 'h5'};
    switch (type) {
      case 'radio':
        return <MultiInputGroup setAnswer={setAnswer} Input={Radio} {...defaultProps}>{choices}</MultiInputGroup>;
      case 'checkbox':
        return <MultiInputGroup setAnswer={setCheckboxAnswer} Input={Checkbox} {...defaultProps}>{choices}</MultiInputGroup>;
      case 'fillblank':
        return <FillBlankGroup setAnswer={setFillblankAnswer} {...defaultProps} />;
      case 'textarea':
        return <TextArea setAnswer={setAnswer} {...defaultProps} />;
      default:
        return <code key={key}>Type '{type}' is incorrect</code>;
    }
  }

  render() {
    const {quiz: {title, questions, resultsSent, correctAnswers, isRunning}} = this.props;
    const allQuestions = questions.filter(({type}) => type !== 'textarea').size;
    return (
      <div className="form-container">
        <h1>{title}</h1>
        <form onSubmit={this.onSubmitForm}>
          {questions.map((question, key) => this.makeQuizElement(question, key, !isRunning))}
          {resultsSent ?
            <p className="bg-success">
              Õigeid vastuseid on {correctAnswers}/{allQuestions}-st. (Ülejäänud kuuluvad ülevaatamisele)
            </p> :
            <button type="submit" className="btn btn-primary">Saada</button>}
        </form>
      </div>
    );
  }
}

export default QuizForm;
