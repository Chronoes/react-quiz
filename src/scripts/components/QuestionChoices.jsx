import React, { Component, PropTypes as Types } from 'react';
import { List, Map, Repeat } from 'immutable';

import Choice from './Choice';

class QuestionChoices extends Component {
  static propTypes = {
    setChoices: Types.func.isRequired,
    children: Types.instanceOf(List),
    type: Types.oneOf(['radio', 'checkbox', 'fillblank']),
    fixed: Types.number,
  };

  static choiceFormat = new Map({ value: '', isAnswer: null });

  constructor(props) {
    super(props);
    this.state = { choices: List.of(QuestionChoices.choiceFormat) };

    this.onChoiceChange = this.onChoiceChange.bind(this);
    this.onAnswerChecking = this.onAnswerChecking.bind(this);
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children) {
      const choices = nextProps.type === this.props.type ? nextProps.children : List.of(QuestionChoices.choiceFormat);
      const choiceSize = (nextProps.fixed || 2) - choices.size;
      if (choiceSize > 0) {
        this.setState({ choices: choices.concat(new Repeat(QuestionChoices.choiceFormat, choiceSize)) });
      } else if (!nextProps.fixed) {
        this.setState({ choices: choices.push(QuestionChoices.choiceFormat) });
      } else {
        this.setState({ choices });
      }
    }
  }

  componentWillUpdate(_, nextState) {
    if (!this.state.choices.equals(nextState.choices)) {
      this.props.setChoices(nextState.choices);
    }
  }

  onChoiceChange(idx, value) {
    const choices = this.state.choices.setIn([idx, 'value'], value);
    if (this.props.type !== 'fillblank') {
      const emptyFieldSize = choices.takeLast(2).count(({ value: val }) => val.length === 0);
      if (emptyFieldSize === 0) {
        return this.setState({ choices: choices.push(QuestionChoices.choiceFormat) });
      } else if (emptyFieldSize === 2) {
        return this.setState({ choices: choices.pop() });
      }
    }
    return this.setState({ choices });
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
            disabled={this.props.type === 'fillblank'}
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
