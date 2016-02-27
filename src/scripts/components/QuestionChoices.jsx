import React, {Component, PropTypes as Types} from 'react';
import {List} from 'immutable';

import Choice from './Choice';

class QuestionChoices extends Component {
  static propTypes = {
    setChoices: Types.func.isRequired,
    children: Types.instanceOf(List),
  };

  constructor(props) {
    super(props);
    this.state = {choices: List.of('')};

    this.onChoiceChange = this.onChoiceChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children) {
      this.setState({choices: nextProps.children.merge(this.state.choices)});
    }
  }

  componentWillUpdate(_, nextState) {
    if (!this.state.choices.equals(nextState.choices)) {
      this.props.setChoices(nextState.choices);
    }
  }

  onChoiceChange(idx, value) {
    const choices = this.state.choices.set(idx, value);
    switch (choices.takeLast(2).count(val => val.length === 0)) {
      case 0:
        this.setState({choices: choices.push('')});
        break;
      case 2:
        this.setState({choices: choices.pop()});
        break;
      default:
        this.setState({choices});
        break;
    }
  }

  render() {
    return (
      <fieldset className="form-group">
        {this.state.choices.map(
          (value, i) => <Choice key={i} id={i} onChange={this.onChoiceChange}>{value}</Choice>)
          .toArray()
        }
      </fieldset>
    );
  }
}

export default QuestionChoices;
