import React, { Component, PropTypes as Types } from 'react';

class QuestionEditControls extends Component {
  static propTypes = {
    children: Types.element.isRequired,
    id: Types.number,
    delete: Types.func.isRequired,
    edit: Types.func.isRequired,
    move: Types.func.isRequired,
    isFirst: Types.bool,
    isLast: Types.bool,
  };

  constructor(props) {
    super(props);

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onMoveClick = this.onMoveClick.bind(this);
  }

  onDeleteClick(event) {
    event.preventDefault();
    this.props.delete(this.props.id);
  }

  onEditClick(event) {
    event.preventDefault();
    this.props.edit(this.props.id);
  }

  onMoveClick(event) {
    event.preventDefault();
    this.props.move(this.props.id, event.target.value);
  }

  render() {
    const { children, isFirst, isLast } = this.props;
    const arrows = ['up', 'down'];
    if (isFirst && isLast) {
      arrows.pop();
      arrows.pop();
    } else if (isFirst) {
      arrows.shift();
    } else if (isLast) {
      arrows.pop();
    }
    return (
      <div className="question-edit-controls clearfix">
        <div className="col-xs-10">{children}</div>
        <div className="btn-toolbar pull-right">
          <div className="arrow-group pull-left">
            {arrows.map((value, i) => (
              <button
                key={i}
                className="btn btn-primary-outline"
                value={value}
                onClick={this.onMoveClick}>
                <i className={`fa fa-chevron-${value}`} />
              </button>
            ))}
          </div>
          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-warning-outline"
              onClick={this.onEditClick}>
              <i className="fa fa-pencil-square-o" />
            </button>
            <button
              className="btn btn-danger-outline"
              onClick={this.onDeleteClick}>
              <i className="fa fa-minus" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionEditControls;
