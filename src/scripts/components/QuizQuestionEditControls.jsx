import React, {Component, PropTypes as Types} from 'react';

import InlineEdit from './InlineEdit';

class QuizQuestionEditControls extends Component {
  static propTypes = {
    children: Types.element.isRequired,
    id: Types.number,
    delete: Types.func,
    textOnly: Types.bool,
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
    const {textOnly, children} = this.props;
    return (
      <div className="question-edit-controls">
        {textOnly ?
          <InlineEdit className={`editable-text ${children.type}`} /> :
          React.cloneElement(children, {
            title: <InlineEdit className={`editable-text ${children.type}`} />,
          }
        )}
        {textOnly ? null :
          <fieldset className="form-group pull-right">
            <button className="btn btn-danger-outline btn-sm" onClick={this.onDeleteClick}><i className="fa fa-minus" /></button>
          </fieldset>}
      </div>
    );
  }
}

export default QuizQuestionEditControls;
