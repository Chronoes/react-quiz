import React, { PropTypes as Types } from 'react';

function Radio({ children, ...props }) {
  return (
    <label htmlFor={props.id} className="custom-control custom-radio">
      <input type="radio" className="custom-control-input" {...props} />
      <span className="custom-control-indicator" />
      <span className="custom-control-description">{children}</span>
    </label>
  );
}

Radio.propTypes = {
  onChange: Types.func.isRequired,
  id: Types.string.isRequired,
  name: Types.string.isRequired,
  value: Types.number.isRequired,
  children: Types.node,
  disabled: Types.bool,
};

export default Radio;
