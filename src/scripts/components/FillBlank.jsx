import React, {Component, PropTypes as Types} from 'react';

class FillBlank extends Component {
  static propTypes = {
    onChange: Types.func.isRequired,
    id: Types.number.isRequired,
    disabled: Types.bool,
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const {onChange, id} = this.props;
    onChange(event.target.value.trim(), id);
  }

  render() {
    return (
      <input
        type="text"
        className="fill-blank"
        onChange={this.onChange}
        required
        disabled={this.props.disabled} />
    );
  }
}

export default FillBlank;
