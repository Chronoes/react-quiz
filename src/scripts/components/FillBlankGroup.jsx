import React, { Component, PropTypes as Types } from 'react';

import { fillBlankSplit, formGroupValidationClass } from '../util';
import FillBlank from './FillBlank';

class FillBlankGroup extends Component {
  static propTypes = {
    questionId: Types.number.isRequired,
    question: Types.string.isRequired,
    Title: Types.node.isRequired,
    setAnswer: Types.func,
    disabled: Types.bool,
    unanswered: Types.bool,
  };

  constructor(props) {
    super(props);

    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(index, answer) {
    this.props.setAnswer(this.props.questionId, index, answer);
  }

  render() {
    const { question, disabled, Title, unanswered } = this.props;
    const blanks = fillBlankSplit(question);
    return (
      <fieldset className="form-group form-inline">
        <Title>Täida lüngad</Title>
        <div className="m-l-1">
          {blanks.map((text, i) => (
            <span key={i}>
              {text}
              {i < blanks.length - 1 ? (
                <div className={formGroupValidationClass(unanswered ? false : null, true)}>
                  <FillBlank id={i} disabled={disabled} onChange={this.onInputChange} />
                </div>
              ) : null}
            </span>
          ))}
        </div>
      </fieldset>
    );
  }
}

export default FillBlankGroup;
