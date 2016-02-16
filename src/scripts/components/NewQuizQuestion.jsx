import React, {Component, PropTypes as Types} from 'react';
import {Map} from 'immutable';

// FIXME: Move this somewhere else along with translations and constants and stuff
const TYPES = new Map({radio: 'Raadionupud', checkbox: 'Linnukesed', fillblank: 'Täida lüngad', textarea: 'Tekstikast'});

class NewQuizQuestion extends Component {
  static propTypes = {
    addQuestion: Types.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {type: TYPES.keySeq().first()};

    this.onSubmit = this.onSubmit.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.addQuestion(this.state.type);
  }

  onTypeChange(event) {
    this.setState({type: event.target.value});
  }

  makeInputs(type) {
    switch (type) {
      case 'radio':
      case 'checkbox':
        return (
          <div>
            <input type="text" className="editable-text h5" placeholder="Küsimus" />
            <div className="form-group">
              <input type="text" className="form-control form-control-sm" placeholder="Valikvastus" />
            </div>
          </div>
        );
      case 'fillblank':
      case 'textarea':
        return <input type="text" className="editable-text h5" placeholder={type === 'fillblank' ? 'Küsimus stiilis: Ohmi seaduse kohaselt takistus = ___ / ___' : 'Küsimus stiilis: Mis on elu mõte?'} />;
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
