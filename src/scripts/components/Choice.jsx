import React, {Component, PropTypes as Types} from 'react';

class Choice extends Component {
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
        className="form-control"
        placeholder="Valikvastus"
        defaultValue={children}
        onChange={this.onChange} />
    );
  }
}

Choice.propTypes = {
  onChange: Types.func.isRequired,
  id: Types.number.isRequired,
  children: Types.string,
};

export default Choice;
