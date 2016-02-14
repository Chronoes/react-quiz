import React, {Component, PropTypes as Types} from 'react';

import FillBlank from './FillBlank';

class FillBlankGroup extends Component {
  static propTypes = {
    id: Types.number.isRequired,
    question: Types.string.isRequired,
    setAnswer: Types.func.isRequired,
    disabled: Types.bool,
  };

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(answer, index) {
    this.props.setAnswer(this.props.id, answer, index);
  }

  render() {
    const {question} = this.props;
    const blanks = question.split(/_{3,}/);
    return (
      <fieldset className="form-group form-inline">
        <h5>Täida lüngad</h5>
        <div className="m-l-1">
          {blanks.map((text, i) => (
            <span key={i}>
              {text}
              {i < blanks.length - 1 ? <FillBlank id={i} disabled={this.props.disabled} onChange={this.onInputChange} /> : ''}
            </span>
          ))}
        </div>
      </fieldset>
    );
  }
}

export default FillBlankGroup;
