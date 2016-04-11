import React, { Component, PropTypes as Types } from 'react';

import Navbar from '../components/Navbar';

/*
 * TODO: Implement JWT login
 * TODO: List all quizzes and activate one
 * TODO: Create new or edit existing quizzes
*/
// FIXME: Temporary route title position, relocate somewhere else
const ROUTE_TITLES = { admin: 'Admin', quiz: 'Quiz' };

class AdminPage extends Component {
  static propTypes = {
    route: Types.object.isRequired,
    children: Types.element,
  };

  render() {
    const { route, children } = this.props;
    return (
      <div>
        <Navbar root={route.path} brand={ROUTE_TITLES[route.path]}>
          {route.childRoutes.map((childRoute) => ({ path: childRoute.path, title: ROUTE_TITLES[childRoute.path] }))}
        </Navbar>
        <div className="container m-t-1">
          {children}
        </div>
      </div>
    );
  }
}

export default AdminPage;
