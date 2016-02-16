import React, {Component, PropTypes as Types} from 'react';

import FillBlank from './FillBlank';

class FillBlankGroup extends Component {
  static propTypes = {
    questionId: Types.number.isRequired,
    question: Types.string.isRequired,
    setAnswer: Types.func.isRequired,
    Title: Types.node.isRequired,
    disabled: Types.bool,
  };

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(index, answer) {
    this.props.setAnswer(this.props.questionId, index, answer);
  }

  render() {
    const {question, disabled, Title} = this.props;
    const blanks = question.split(/_{3,}/);
    return (
      <fieldset className="form-group form-inline">
        <Title>Täida lüngad</Title>
        <div className="m-l-1">
          {blanks.map((text, i) => (
            <span key={i}>
              {text}
              {i < blanks.length - 1 ? <FillBlank id={i} disabled={disabled} onChange={this.onInputChange} /> : ''}
            </span>
          ))}
        </div>
      </fieldset>
    );
  }
}

export default FillBlankGroup;
