import React, {Component, PropTypes as Types} from 'react';

class TextArea extends Component {
  static propTypes = {
    questionId: Types.number.isRequired,
    question: Types.string.isRequired,
    setAnswer: Types.func.isRequired,
    disabled: Types.bool.isRequired,
    Title: Types.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.setAnswer(this.props.questionId, event.target.value.trim());
  }

  render() {
    const {question, disabled, Title} = this.props;
    return (
      <fieldset className="form-group">
        <Title>{question}</Title>
        <div className="m-l-1">
          <textarea
            className="form-control"
            placeholder="Kirjuta oma vastus"
            onChange={this.onChange}
            required
            disabled={disabled} />
        </div>
      </fieldset>
    );
  }
}

export default TextArea;
