import React, {Component, PropTypes as Types} from 'react';
import {List} from 'immutable';

import Radio from './Radio';
import Checkbox from './Checkbox';

class MultiInputGroup extends Component {
  static propTypes = {
    questionId: Types.number.isRequired,
    question: Types.string.isRequired,
    children: Types.instanceOf(List).isRequired,
    setAnswer: Types.func.isRequired,
    Title: Types.node.isRequired,
    Input: Types.oneOf([Radio, Checkbox]).isRequired,
    disabled: Types.bool,
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.setAnswer(this.props.questionId, parseInt(event.target.value, 10));
  }

  render() {
    const {question, questionId, children, disabled, Title, Input} = this.props;
    return (
      <fieldset className="form-group">
        <Title>{question}</Title>
        <div className={`c-inputs-stacked m-l-1 ${disabled ? 'disabled' : ''}`}>
          {children.map(({id, value}, i) => (
            <Input
              key={i}
              name={questionId}
              value={id}
              onChange={this.onChange}
              disabled={disabled}>
              {value}
            </Input>
          ))}
        </div>
      </fieldset>
    );
  }
}

export default MultiInputGroup;
