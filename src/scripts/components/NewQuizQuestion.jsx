import React, {Component, PropTypes as Types} from 'react';
import {Map, List} from 'immutable';

import QuestionTitle from './QuestionTitle';
import QuestionChoices from './QuestionChoices';

// FIXME: Move this somewhere else along with translations and constants and stuff
const TYPES = new Map({radio: 'Raadionupud', checkbox: 'Linnukesed', fillblank: 'Täida lüngad', textarea: 'Tekstikast'});

class NewQuizQuestion extends Component {
  static propTypes = {
    add: Types.func.isRequired,
    setTitle: Types.func.isRequired,
    addChoices: Types.func.isRequired,
    setChoiceValue: Types.func.isRequired,
    questionId: Types.number.isRequired,
    question: Types.instanceOf(Map),
  };

  constructor(props) {
    super(props);
    this.state = {
      type: TYPES.keySeq().first(),
      title: '',
      choices: new List(''),
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onChoiceAdd = this.onChoiceAdd.bind(this);
    this.setChoiceValue = this.setChoiceValue.bind(this);
  }

  componentDidUpdate(_, prevState) {
    if (this.props.question) {
      const {title, choices} = this.state;
      if (prevState.title !== title) {
        this.props.setTitle(this.props.questionId, title);
      }
      if (prevState.choices.size < choices.size) {
        this.props.addChoices(this.props.questionId, choices);
      }
    }
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.add(this.state.type);
  }

  onTypeChange(event) {
    this.setState({type: event.target.value});
  }

  onTitleChange(event) {
    this.setState({title: event.target.value.trim()});
  }

  onChoiceAdd() {
    this.setState({choices: this.state.choices.push('')});
  }

  setChoiceValue(idx, value) {
    this.props.setChoiceValue(this.props.questionId, idx, value);
  }

  makeInputs(type) {
    const {title, choices} = this.state;
    switch (type) {
      case 'radio':
      case 'checkbox':
        return (
          <div>
            <QuestionTitle placeholder="Küsimus" onChange={this.onTitleChange}>
              {title}
            </QuestionTitle>
            <QuestionChoices
              add={this.onChoiceAdd}
              setValue={this.setChoiceValue}>
              {choices.map(choice => choice.get('value'))}
            </QuestionChoices>
          </div>
        );
      case 'fillblank':
        return (
          <QuestionTitle placeholder="Küsimus stiilis: Ohmi seaduse kohaselt: takistus = ___ / ___" onChange={this.onTitleChange}>
            {title}
          </QuestionTitle>
        );
      case 'textarea':
        return (
          <QuestionTitle placeholder="Küsimus stiilis: Mis on elu mõte?" onChange={this.onTitleChange}>
            {title}
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
