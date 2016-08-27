import React, { Component, PropTypes as Types } from 'react';

import { formGroupValidationClass } from '../util';

class TextArea extends Component {
  static propTypes = {
    questionId: Types.number.isRequired,
    question: Types.string.isRequired,
    disabled: Types.bool.isRequired,
    Title: Types.node.isRequired,
    setAnswer: Types.func,
    unanswered: Types.bool,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.setAnswer(this.props.questionId, event.target.value);
  }

  render() {
    const { question, disabled, Title, unanswered } = this.props;
    return (
      <fieldset className="form-group">
        <Title>{question}</Title>
        <div className={`${formGroupValidationClass(unanswered ? false : null, true)} m-l-1`}>
          <textarea
            className="form-control"
            placeholder="Kirjuta oma vastus"
            onKeyUp={this.onChange}
            onBlur={this.onChange}
            disabled={disabled} />
        </div>
      </fieldset>
    );
  }
}

export default TextArea;
