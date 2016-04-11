import React, { PropTypes as Types } from 'react';

function Radio({ children, ...props }) {
  return (
    <label className="c-input c-radio">
      <input type="radio" required {...props} />
      <span className="c-indicator"></span>
      {children}
    </label>
  );
}

Radio.propTypes = {
  onChange: Types.func.isRequired,
  children: Types.string.isRequired,
  name: Types.node.isRequired,
  value: Types.number.isRequired,
  disabled: Types.bool,
};

export default Radio;
