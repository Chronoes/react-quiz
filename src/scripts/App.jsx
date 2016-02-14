import React, {PropTypes as Types} from 'react';

function App({children}) {
  return (
    <div>
      {children}
    </div>
  );
}

App.displayName = 'App';
App.propTypes = {
  children: Types.element,
};

export default App;
