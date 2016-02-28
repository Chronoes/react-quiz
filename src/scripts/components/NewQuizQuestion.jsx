import React, {Component, PropTypes as Types} from 'react';
import {Map} from 'immutable';

import QuestionTitle from './QuestionTitle';
import QuestionChoices from './QuestionChoices';

// FIXME: Move this somewhere else along with translations and constants and stuff
const TYPES = new Map({radio: 'Raadionupud', checkbox: 'Linnukesed', fillblank: 'Täida lüngad', textarea: 'Tekstikast'});

class NewQuizQuestion extends Component {
  static propTypes = {
    add: Types.func.isRequired,
    setTitle: Types.func.isRequired,
    setChoices: Types.func.isRequired,
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
    this.onChoicesChange = this.onChoicesChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.question && nextProps.questionId !== this.props.questionId) {
      this.setState({title: nextProps.question.get('question'), type: nextProps.question.get('type')});
    }
  }

  componentDidUpdate(_, prevState) {
    const {question, setTitle} = this.props;
    if (question) {
      const {title} = this.state;
      if (prevState.title !== title) {
        setTitle(title);
      }
      if (this.refs.choices && question.get('choices').size === 0) {
        this.onChoicesChange(this.refs.choices.state.choices);
      }
    }
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.add(this.state.type, this.state.title);
  }

  onTypeChange(event) {
    this.setState({type: event.target.value});
  }

  onTitleChange(event) {
    this.setState({title: event.target.value.trim()});
  }

  onChoicesChange(choices) {
    if (this.props.question) {
      this.props.setChoices(choices);
    }
  }

  makeInputs(type) {
    const {title} = this.state;
    switch (type) {
      case 'radio':
      case 'checkbox':
        return (
          <div>
            <QuestionTitle placeholder="Küsimus" onChange={this.onTitleChange}>
              {title}
            </QuestionTitle>
            <QuestionChoices
              ref="choices"
              setChoices={this.onChoicesChange}>
              {this.props.question ? this.props.question.get('choices').map(choice => choice.get('value')) : null}
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
          {TYPES.map((title, type) => (
            <option key={type} value={type} selected={type === this.state.type}>{title}</option>))
            .toArray()}
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
