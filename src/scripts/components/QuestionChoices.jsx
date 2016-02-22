import React, {Component, PropTypes as Types} from 'react';
import {List} from 'immutable';

import Choice from './Choice';

class QuestionChoices extends Component {
  static propTypes = {
    add: Types.func.isRequired,
    setValue: Types.func.isRequired,
    children: Types.instanceOf(List).isRequired,
  };

  constructor(props) {
    super(props);

    // this.onChange = this.onChange.bind(this);
    this.onChoiceChange = this.onChoiceChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({choices: nextProps.children});
  }

  onChoiceChange(idx, value) {
    this.setState({choices: this.state.choices.set(idx, value)});
  }

  render() {
    return (
      <div className="input-group input-group-sm">
        {this.props.children.map((value, i) => <Choice key={i} id={i} onChange={this.onChoiceChange}>{value}</Choice>)}
      </div>
    );
  }
}

export default QuestionChoices;
