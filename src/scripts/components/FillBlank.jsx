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
    this.props.onChange(this.props.id, event.target.value.trim());
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
