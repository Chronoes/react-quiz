import React, { Component, PropTypes as Types } from 'react';

import Checkbox from './Checkbox';

class Choice extends Component {
  static propTypes = {
    onChange: Types.func.isRequired,
    onAnswerChecking: Types.func.isRequired,
    id: Types.number.isRequired,
    isAnswer: Types.bool,
    children: Types.string,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onChange(event) {
    this.props.onChange(this.props.id, event.target.value);
  }

  onCheckboxChange(event) {
    this.props.onAnswerChecking(this.props.id, event.target.checked);
  }

  render() {
    const { children, id, isAnswer } = this.props;
    return (
      <div>
        <div className="col-xs-10">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Valikvastus"
            value={children}
            onChange={this.onChange} />
        </div>
        <div className="col-xs-2">
          <Checkbox name="newChoice" value={id} checked={isAnswer} onChange={this.onCheckboxChange}>
            {isAnswer ? <span className="text-success">Vastus</span> : 'Valik'}
          </Checkbox>
        </div>
      </div>
    );
  }
}

export default Choice;
