import React, {Component, PropTypes as Types} from 'react';
import {Map} from 'immutable';

import QuestionTitle from './QuestionTitle';

// FIXME: Move this somewhere else along with translations and constants and stuff
const TYPES = new Map({radio: 'Raadionupud', checkbox: 'Linnukesed', fillblank: 'Täida lüngad', textarea: 'Tekstikast'});

class NewQuizQuestion extends Component {
  static propTypes = {
    addQuestion: Types.func.isRequired,
    setQuestionTitle: Types.func.isRequired,
    questionId: Types.number.isRequired,
    question: Types.instanceOf(Map),
  };

  constructor(props) {
    super(props);
    this.state = {
      type: TYPES.keySeq().first(),
      title: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }

  componentDidUpdate(_, prevState) {
    if (this.props.question && prevState.title !== this.state.title) {
      this.props.setQuestionTitle(this.props.questionId, this.state.title);
    }
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.addQuestion(this.state.type);
  }

  onTypeChange(event) {
    this.setState({type: event.target.value});
  }

  onTitleChange(event) {
    this.setState({title: event.target.value.trim()});
  }

  makeInputs(type) {
    const {question} = this.props;
    const questionString = question ? question.get('question') : '';
    switch (type) {
      case 'radio':
      case 'checkbox':
        return (
          <div>
            <QuestionTitle placeholder="Küsimus" onChange={this.onTitleChange}>
              {questionString}
            </QuestionTitle>
            <div className="input-group input-group-sm">
              <input type="text" className="form-control" placeholder="Valikvastus" />
            </div>
          </div>
        );
      case 'fillblank':
        return (
          <QuestionTitle ref="fillb" placeholder="Küsimus stiilis: Ohmi seaduse kohaselt: takistus = ___ / ___" onChange={this.onTitleChange}>
            {questionString}
          </QuestionTitle>
        );
      case 'textarea':
        return (
          <QuestionTitle placeholder="Küsimus stiilis: Mis on elu mõte?" onChange={this.onTitleChange}>
            {questionString}
          </QuestionTitle>
          );
      default:
        return <code>Type '{type}' is incorrect</code>;
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <select className="form-group c-select col-xs-4" onChange={this.onTypeChange}>
          {TYPES.map((title, type) => <option key={type} value={type}>{title}</option>).toArray()}
        </select>
        <div className="col-xs-1">
          <button type="submit" className="btn btn-success pull-left"><i className="fa fa-plus" /></button>
        </div>
        <small className="text-muted">Abistav tekst</small>
        <div className="form-group">
          {this.makeInputs(this.state.type)}
        </div>
      </form>
    );
  }
}

export default NewQuizQuestion;
