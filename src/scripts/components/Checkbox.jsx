import React, {Component, PropTypes as Types} from 'react';
import {Map} from 'immutable';

class Checkbox extends Component {
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

  onChange(event) {
    const {onChange, id, children} = this.props;
    onChange(event.target.checked ? children.get('id') : 0, id);
  }

  render() {
    const {id, children, disabled} = this.props;
    return (
      <label className="c-input c-checkbox">
        <input
          type="checkbox"
          name={id}
          onChange={this.onChange}
          disabled={disabled} />
        <span className="c-indicator" />
        {children.get('value')}
      </label>
    );
  }
}

export default Checkbox;
