import React, {Component, PropTypes as Types, Children} from 'react';

import Navbar from '../components/Navbar';

/* TODO:
 * Implement JWT login
 * List all quizzes and activate one
 * Create new or edit existing quizzes
 * Allow adding and editing questions and rearranging them (up/down arrow keys or buttons, maybe drag-drop later)
*/
// FIXME: Temporary route title position, relocate somewhere else
const ROUTE_TITLES = {admin: 'Admin', quiz: 'Quiz'};

class AdminPage extends Component {
  static propTypes = {
    route: Types.object.isRequired,
    children: Types.element,
  };

  render() {
    const {route, children} = this.props;
    const extendedChildren = Children.map(children, child => React.cloneElement(child, {isAdmin: true}));
    return (
      <div>
        <Navbar root={route.path} brand={ROUTE_TITLES[route.path]}>
          {route.childRoutes.map(childRoute => {
            return {path: childRoute.path, title: ROUTE_TITLES[childRoute.path]};
          })}
        </Navbar>
        <div className="container m-t-1">
          {extendedChildren}
        </div>
      </div>
    );
  }
}

export default AdminPage;
