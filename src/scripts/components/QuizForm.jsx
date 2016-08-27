import React, { Component, PropTypes as Types } from 'react';
import { Map, List } from 'immutable';

import MultiInputGroup from './MultiInputGroup';
import Radio from './Radio';
import Checkbox from './Checkbox';
import TextArea from './TextArea';
import FillBlankGroup from './FillBlankGroup';

// TODO: add confirmation when manually finishing quiz and unanswered questions exist

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

    this.state = { confirmFinish: false, unanswered: new List() };
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.makeQuizElement = this.makeQuizElement.bind(this);
  }

  componentDidUpdate() {
    const { quiz } = this.props;
    const { resultsSent, isRunning, timeSpent } = quiz;
    if (!resultsSent && !isRunning && timeSpent > 0) {
      this.props.actions.sendResults(quiz);
    }
  }

  onSubmitForm(event) {
    event.preventDefault();
    const unanswered = this.props.quiz.get('questions')
      .filterNot(({ userAnswer, userAnswers }) => userAnswer || userAnswers.count((value) => value) > 0);

    if (unanswered.size === 0 || this.state.confirmFinish) {
      this.props.actions.finishQuiz();
    } else {
      this.setState({ unanswered });
    }
  }

  makeQuizElement(question, key, disabled) {
    const { type, question: questionTitle, choices } = question;
    const { actions: { setAnswer, setCheckboxAnswer, setFillblankAnswer } } = this.props;
    const { unanswered, confirmFinish } = this.state;

    const defaultProps = {
      key,
      questionId: key,
      disabled,
      question: questionTitle,
      Title: 'legend',
      unanswered: !confirmFinish && unanswered.includes(question),
    };
    switch (type) {
      case 'radio':
        return (<MultiInputGroup setAnswer={setAnswer} Input={Radio} {...defaultProps}>{choices}</MultiInputGroup>);
      case 'checkbox':
        return (
          <MultiInputGroup
            setAnswer={setCheckboxAnswer}
            Input={Checkbox}
            {...defaultProps}>
            {choices}
          </MultiInputGroup>
        );
      case 'fillblank':
        return (<FillBlankGroup setAnswer={setFillblankAnswer} {...defaultProps} />);
      case 'textarea':
        return (<TextArea setAnswer={setAnswer} {...defaultProps} />);
      default:
        return (<code key={key}>Type '{type}' is incorrect</code>);
    }
  }

  render() {
    const { quiz: { title, questions, resultsSent, correctAnswers, isRunning } } = this.props;
    const allQuestions = questions.count(({ type }) => type !== 'textarea');
    return (
      <div className="form-container">
        <h1>{title}</h1>
        <form onSubmit={this.onSubmitForm}>
          {questions.map((question, key) => this.makeQuizElement(question, key, !isRunning))}
          <fieldset className="form-group">
            {resultsSent ?
              <p className="bg-success">
                Õigeid vastuseid on {correctAnswers}/{allQuestions}-st. (Ülejäänud kuuluvad ülevaatamisele)
              </p> :
              <button type="submit" className="btn btn-primary">Saada</button>}
          </fieldset>
        </form>
      </div>
    );
  }
}

export default QuizForm;
