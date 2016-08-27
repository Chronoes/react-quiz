import { PropTypes as Types } from 'react';

function App({ children }) {
  return children;
}

App.displayName = 'App';
App.propTypes = {
  children: Types.element,
};

export default App;
