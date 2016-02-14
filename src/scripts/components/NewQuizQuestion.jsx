import React, {Component, PropTypes as Types} from 'react';
import {Map} from 'immutable';
// FIXME: Move this somewhere else along with translations and constants and stuff
const TYPES = new Map({radio: 'Radio', checkbox: 'Checkbox', fillblank: 'Fill blanks', textarea: 'Text area'});

class NewQuizQuestion extends Component {
  static propTypes = {
    addQuestion: Types.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.state = {type: TYPES.keySeq().first()};
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.addQuestion(this.state.type);
  }

  onTypeChange(event) {
    this.setState({type: event.target.value});
  }

  render() {
    return (
      <form className="form-inline" onSubmit={this.onSubmit}>
        <select className="form-group c-select" onChange={this.onTypeChange}>
          {TYPES.map((title, type) => <option key={type} value={type}>{title}</option>).toArray()}
        </select>
        <button type="submit" className="btn btn-success"><i className="fa fa-plus" /></button>
      </form>
    );
  }
}

export default NewQuizQuestion;
