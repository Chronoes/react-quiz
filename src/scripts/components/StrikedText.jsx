import React, {PropTypes as Types} from 'react';

function StrikedText({children}) {
  return (
    <div className="striked-text-wrapper">
      <span className="striked-text">
        {children}
      </span>
    </div>
  );
}

StrikedText.propTypes = {
  children: Types.string,
};

export default StrikedText;
