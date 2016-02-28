import React, {PropTypes as Types} from 'react';

function QuestionTitle({children, ...props}) {
  return <input type="text" className="editable-text h5" value={children} {...props} />;
}

QuestionTitle.propTypes = {
  onChange: Types.func.isRequired,
  children: Types.string,
  placeholder: Types.string,
};

export default QuestionTitle;
