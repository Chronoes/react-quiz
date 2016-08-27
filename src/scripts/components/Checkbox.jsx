import React, { PropTypes as Types } from 'react';

function Checkbox({ children, ...props }) {
  return (
    <label htmlFor={props.id} className="custom-control custom-checkbox">
      <input type="checkbox" className="custom-control-input" {...props} />
      <span className="custom-control-indicator" />
      <span className="custom-control-description">{children}</span>
    </label>
  );
}

Checkbox.propTypes = {
  onChange: Types.func.isRequired,
  id: Types.string.isRequired,
  name: Types.string.isRequired,
  value: Types.number.isRequired,
  children: Types.node,
  disabled: Types.bool,
};

export default Checkbox;
