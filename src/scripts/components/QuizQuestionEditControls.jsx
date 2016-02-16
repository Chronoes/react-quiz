import React, {Component, PropTypes as Types} from 'react';

class QuizQuestionEditControls extends Component {
  static propTypes = {
    children: Types.element.isRequired,
    id: Types.number,
    delete: Types.func,
  };

  constructor(props) {
    super(props);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  onDeleteClick(event) {
    event.preventDefault();
    this.props.delete(this.props.id);
  }

  render() {
    const {children} = this.props;
    return (
      <div className="question-edit-controls">
        {children}
        <fieldset className="form-group pull-right">
          <button className="btn btn-danger-outline btn-sm" onClick={this.onDeleteClick}><i className="fa fa-minus" /></button>
        </fieldset>
      </div>
    );
  }
}

export default QuizQuestionEditControls;
