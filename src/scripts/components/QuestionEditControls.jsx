import React, {Component, PropTypes as Types} from 'react';

class QuestionEditControls extends Component {
  static propTypes = {
    children: Types.element.isRequired,
    id: Types.number,
    delete: Types.func,
    edit: Types.func,
    move: Types.func,
  };

  constructor(props) {
    super(props);

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
  }

  onDeleteClick(event) {
    event.preventDefault();
    this.props.delete(this.props.id);
  }

  onEditClick(event) {
    event.preventDefault();
    this.props.edit(this.props.id);
  }

  render() {
    const {children} = this.props;
    return (
      <div className="question-edit-controls">
        <div className="col-xs-10">{children}</div>
        <fieldset className="form-group pull-right">
          <button
            className="btn btn-warning-outline btn-sm"
            onClick={this.onEditClick}>
            <i className="fa fa-pencil-square-o" />
          </button>
          <button
            className="btn btn-danger-outline btn-sm"
            onClick={this.onDeleteClick}>
            <i className="fa fa-minus" />
          </button>
        </fieldset>
      </div>
    );
  }
}

export default QuestionEditControls;
