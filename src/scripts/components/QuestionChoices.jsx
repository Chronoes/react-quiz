import React, { Component, PropTypes as Types } from 'react';
import { List, Map } from 'immutable';

import Choice from './Choice';

class QuestionChoices extends Component {
  static propTypes = {
    setChoices: Types.func.isRequired,
    children: Types.instanceOf(List),
  };

  static choiceFormat = new Map({ value: '', isAnswer: null });

  constructor(props) {
    super(props);
    this.state = { choices: new List() };

    this.onChoiceChange = this.onChoiceChange.bind(this);
    this.onAnswerChecking = this.onAnswerChecking.bind(this);
  }

  componentWillMount() {
    this.setState({ choices: this.state.choices.push(QuestionChoices.choiceFormat) });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children && nextProps.children.size > 0) {
      this.setState({ choices: nextProps.children.push(QuestionChoices.choiceFormat) });
    }
  }

  componentWillUpdate(_, nextState) {
    if (!this.state.choices.equals(nextState.choices)) {
      this.props.setChoices(nextState.choices);
    }
  }

  onChoiceChange(idx, value) {
    const choices = this.state.choices.setIn([idx, 'value'], value);
    switch (choices.takeLast(2).count(({ value: val }) => val.length === 0)) {
      case 0:
        this.setState({ choices: choices.push(QuestionChoices.choiceFormat) });
        break;
      case 2:
        this.setState({ choices: choices.pop() });
        break;
      default:
        this.setState({ choices });
        break;
    }
  }

  onAnswerChecking(idx, isAnswer) {
    this.setState({ choices: this.state.choices.setIn([idx, 'isAnswer'], isAnswer) });
  }

  render() {
    return (
      <fieldset className="form-group">
        {this.state.choices.map(({ value, isAnswer }, i) => (
          <Choice
            key={i}
            id={i}
            isAnswer={isAnswer}
            onChange={this.onChoiceChange}
            onAnswerChecking={this.onAnswerChecking}>
            {value}
          </Choice>
        )).toArray()}
      </fieldset>
    );
  }
}

export default QuestionChoices;
