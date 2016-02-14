import React, {Component, PropTypes as Types} from 'react';
import {List} from 'immutable';

import Radio from './Radio';

class RadioGroup extends Component {
  static propTypes = {
    id: Types.number.isRequired,
    question: Types.string.isRequired,
    children: Types.instanceOf(List).isRequired,
    setAnswer: Types.func.isRequired,
    disabled: Types.bool,
  };

  constructor(props) {
    super(props);
    this.onRadioChange = this.onRadioChange.bind(this);
  }

  onRadioChange(answer) {
    const {setAnswer, id} = this.props;
    setAnswer(id, answer);
  }

  render() {
    const {question, children, disabled} = this.props;
    return (
      <fieldset className="form-group">
        <h5>{question}</h5>
        <div className={`c-inputs-stacked m-l-1 ${disabled ? 'disabled' : ''}`}>
          {children.map((value, i) => (
            <Radio key={i} id={i} onChange={this.onRadioChange} disabled={this.props.disabled}>{value}</Radio>
          ))}
        </div>
      </fieldset>
    );
  }
}

export default RadioGroup;
