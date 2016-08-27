import React, { Component, PropTypes as Types } from 'react';
import { List } from 'immutable';

import { formGroupValidationClass } from '../util';
import Radio from './Radio';
import Checkbox from './Checkbox';

class MultiInputGroup extends Component {
  static propTypes = {
    questionId: Types.number.isRequired,
    question: Types.string.isRequired,
    children: Types.instanceOf(List).isRequired,
    Title: Types.node.isRequired,
    Input: Types.oneOf([Radio, Checkbox]).isRequired,
    setAnswer: Types.func,
    disabled: Types.bool,
    unanswered: Types.bool,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.setAnswer(this.props.questionId, parseInt(event.target.value, 10));
  }

  render() {
    const { question, questionId, children, disabled, Title, Input, unanswered } = this.props;
    return (
      <fieldset className="form-group">
        <Title>{question}</Title>
        <div className={`custom-controls-stacked m-l-1${disabled ? ' disabled' : ''}`}>
          {children.map(({ id, value }, i) => (
            <div key={i} className={formGroupValidationClass(unanswered ? false : null, true)}>
              <Input
                key={i}
                id={`q${questionId}-${id}`}
                name={`q${questionId}`}
                value={id}
                onChange={this.onChange}
                disabled={disabled}>
                {value}
              </Input>
            </div>
          ))}
        </div>
      </fieldset>
    );
  }
}

export default MultiInputGroup;
