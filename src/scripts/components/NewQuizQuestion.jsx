import React, { Component, PropTypes as Types } from 'react';
import { Map } from 'immutable';

import QuestionTitle from './QuestionTitle';
import QuestionChoices from './QuestionChoices';
import FillBlankGroup from './FillBlankGroup';

// FIXME: Move this somewhere else along with translations and constants and stuff
const TYPES = new Map({ radio: 'Raadionupud', checkbox: 'Linnukesed', fillblank: 'Täida lüngad', textarea: 'Tekstikast' });
const placeholders = new Map({ radio: 'Küsimus', checkbox: 'Küsimus', fillblank: 'Küsimus stiilis: Ohmi seaduse kohaselt: takistus = ___ / ___', textarea: 'Küsimus stiilis: Mis on elu mõte?' });

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
      this.setState({ title: nextProps.question.get('question'), type: nextProps.question.get('type') });
    }
  }

  // componentDidUpdate(_, prevState) {
  //   const { question, setTitle } = this.props;
  //   if (question) {
  //     const { title } = this.state;
  //     if (prevState.title !== title) {
  //       setTitle(title);
  //     }
  //   }
  // }

  onSubmit(event) {
    event.preventDefault();
    this.props.add(this.state.type, this.state.title);
    this.props.setChoices(this.refs.choices.state.choices);
  }

  onTypeChange(event) {
    this.setState({ type: event.target.value });
  }

  onTitleChange(event) {
    this.setState({ title: event.target.value });
    if (this.props.question) {
      this.props.setTitle(event.target.value);
    }
  }

  onChoicesChange(choices) {
    if (this.props.question) {
      this.props.setChoices(choices);
    }
  }

  makeInputs(type, title) {
    if (!TYPES.has(type)) {
      return <code>Type '{type}' is incorrect</code>;
    }

    const titleElement = (
      <QuestionTitle placeholder={placeholders.get(type)} onChange={this.onTitleChange}>
        {title}
      </QuestionTitle>
    );

    const extraProps = {};
    if (type === 'textarea') {
      return titleElement;
    } else if (type === 'fillblank') {
      extraProps.fixed = FillBlankGroup.split(title).length - 1;
    }
    return (
      <div>
        {titleElement}
        <QuestionChoices
          ref="choices"
          type={type}
          setChoices={this.onChoicesChange}
          {...extraProps}>
          {this.props.question ? this.props.question.get('choices') : null}
        </QuestionChoices>
      </div>
    );
  }

  render() {
    const { type, title } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <select className="form-group c-select col-xs-4" value={type} onChange={this.onTypeChange}>
          {TYPES.map((value, key) => (
            <option key={key} value={key}>{value}</option>))
            .toArray()}
        </select>
        <div className="col-xs-1">
          <button type="submit" className="btn btn-success pull-left"><i className="fa fa-plus" /></button>
        </div>
        <small className="text-muted">Abistav tekst</small>
        <div className="form-group">
          {this.makeInputs(type, title)}
        </div>
      </form>
    );
  }
}

export default NewQuizQuestion;
