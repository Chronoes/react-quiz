import React, {Component, PropTypes as Types} from 'react';
import {Map} from 'immutable';

class Radio extends Component {
  static propTypes = {
    onChange: Types.func.isRequired,
    children: Types.instanceOf(Map).isRequired,
    id: Types.number.isRequired,
    disabled: Types.bool,
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const {onChange, id} = this.props;
    onChange(id);
  }

  render() {
    const {id, children, disabled} = this.props;
    return (
      <label className="c-input c-radio">
        <input
          type="radio"
          name={id}
          onChange={this.onChange}
          required
          disabled={disabled} />
        <span className="c-indicator"></span>
      {children.get('value')}
      </label>
    );
  }
}

export default Radio;
