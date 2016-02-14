import React, {Component, PropTypes as Types} from 'react';

class TextArea extends Component {
  static propTypes = {
    id: Types.number.isRequired,
    question: Types.string.isRequired,
    setAnswer: Types.func.isRequired,
    disabled: Types.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const {setAnswer, id} = this.props;
    setAnswer(id, event.target.value.trim());
  }

  render() {
    const {question, disabled} = this.props;
    return (
      <fieldset className="form-group">
      <h5>{question}</h5>
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
