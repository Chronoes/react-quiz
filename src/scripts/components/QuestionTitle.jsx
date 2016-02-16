import React, {Component, PropTypes as Types} from 'react';

class QuestionTitle extends Component {
  static propTypes = {
    onChange: Types.func.isRequired,
    children: Types.string,
    placeholder: Types.string,
  };

  render() {
    const {children, ...props} = this.props;
    return (
      <input type="text" className="editable-text h5" defaultValue={children} {...props} />
    );
  }
}

export default QuestionTitle;
