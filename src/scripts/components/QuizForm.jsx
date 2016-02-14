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
    if (!quiz.get('resultsSent') && !quiz.get('isRunning') && quiz.get('timeSpent') > 0) {
      this.props.actions.sendResults(quiz);
    }
  }

  onSubmitForm(event) {
    event.preventDefault();
    this.props.actions.finishQuiz();
  }

  makeQuizElement(question, key) {
    const {quiz, actions: {setAnswer, setMultiAnswer}} = this.props;
    const defaultProps = {key, id: key, disabled: !quiz.get('isRunning'), question: question.get('question'), title: <h5 />};
    switch (question.get('type')) {
      case 'radio':
        return <RadioGroup setAnswer={setAnswer} {...defaultProps}>{question.get('choices')}</RadioGroup>;
      case 'checkbox':
        return <CheckboxGroup setAnswer={setMultiAnswer} {...defaultProps}>{question.get('choices')}</CheckboxGroup>;
      case 'fillblank':
        return <FillBlankGroup setAnswer={setMultiAnswer} {...defaultProps} />;
      case 'textarea':
        return <TextArea setAnswer={setAnswer} {...defaultProps} />;
      default:
        return <code key={key}>Type '{question.get('type')}' is incorrect</code>;
    }
  }

  render() {
    const {quiz} = this.props;
    const questions = quiz.get('questions');
    const allQuestions = questions.filter(q => q.get('type') !== 'textarea').size;
    return (
      <div className="form-container">
        <h1>{quiz.get('title')}</h1>
        <form onSubmit={this.onSubmitForm}>
          {questions.map(this.makeQuizElement)}
          {quiz.get('resultsSent') ?
            <div className="bg-success text-center">
              Õigeid vastuseid on {quiz.get('correctAnswers')}/{allQuestions}-st. (Ülejäänud kuuluvad ülevaatamisele)
            </div> :
            <button type="submit" className="btn btn-primary">Saada</button>}
        </form>
      </div>
    );
  }
}

export default QuizForm;
