import React, {PropTypes as Types} from 'react';

function Checkbox({children, ...props}) {
  return (
    <label className="c-input c-checkbox">
      <input type="checkbox" {...props} />
      <span className="c-indicator"></span>
      {children}
    </label>
  );
}

Checkbox.propTypes = {
  onChange: Types.func.isRequired,
  children: Types.string.isRequired,
  name: Types.node.isRequired,
  value: Types.number.isRequired,
  disabled: Types.bool,
};

export default Checkbox;
