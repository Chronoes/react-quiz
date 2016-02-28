import React, {Component, PropTypes as Types} from 'react';

class Choice extends Component {
  static propTypes = {
    onChange: Types.func.isRequired,
    id: Types.number.isRequired,
    children: Types.string,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.onChange(this.props.id, event.target.value.trim());
  }

  render() {
    const {children} = this.props;
    return (
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder="Valikvastus"
        value={children}
        onChange={this.onChange} />
    );
  }
}

export default Choice;
