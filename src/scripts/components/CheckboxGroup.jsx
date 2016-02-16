import React, {Component, PropTypes as Types} from 'react';
import {List} from 'immutable';

import Checkbox from './Checkbox';

class CheckboxGroup extends Component {
  static propTypes = {
    id: Types.number.isRequired,
    question: Types.string.isRequired,
    children: Types.instanceOf(List).isRequired,
    setAnswer: Types.func.isRequired,
    Title: Types.node.isRequired,
    disabled: Types.bool,
  };

  constructor(props) {
    super(props);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onCheckboxChange(answer, index) {
    const {setAnswer, id} = this.props;
    setAnswer(id, answer, index);
  }

  render() {
    const {question, disabled, children, Title} = this.props;
    return (
      <fieldset className="form-group">
        <Title>{question}</Title>
        <div className={`c-inputs-stacked m-l-1 ${disabled ? 'disabled' : ''}`}>
          {children.map((value, i) => (
            <Checkbox key={i} id={i} onChange={this.onCheckboxChange} disabled={disabled}>{value}</Checkbox>
          ))}
        </div>
      </fieldset>
    );
  }
}

export default CheckboxGroup;
