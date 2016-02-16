import React, {Component, PropTypes as Types} from 'react';
import {Map} from 'immutable';

import RadioGroup from './RadioGroup';
import CheckboxGroup from './CheckboxGroup';
import TextArea from './TextArea';
import FillBlankGroup from './FillBlankGroup';

class QuizForm extends Component {
  static propTypes = {
    actions: Types.shape({
      sendResults: Types.func,
      finishQuiz: Types.func,
      setAnswer: Types.func,
      setMultiAnswer: Types.func,
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
    const {actions: {setAnswer, setMultiAnswer}} = this.props;
    const defaultProps = {key, id: key, disabled, question, Title: 'h5'};
    switch (type) {
      case 'radio':
        return <RadioGroup setAnswer={setAnswer} {...defaultProps}>{choices}</RadioGroup>;
      case 'checkbox':
        return <CheckboxGroup setAnswer={setMultiAnswer} {...defaultProps}>{choices}</CheckboxGroup>;
      case 'fillblank':
        return <FillBlankGroup setAnswer={setMultiAnswer} {...defaultProps} />;
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
            <p className="bg-success text-center">
              Õigeid vastuseid on {correctAnswers}/{allQuestions}-st. (Ülejäänud kuuluvad ülevaatamisele)
            </p> :
            <button type="submit" className="btn btn-primary">Saada</button>}
        </form>
      </div>
    );
  }
}

export default QuizForm;
