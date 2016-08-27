import React, { PropTypes as Types } from 'react';

import Navbar from '../components/Navbar';

/*
* TODO: Implement JWT login
* TODO: Activate a single quiz
* TODO: Edit existing quizzes
*/
// FIXME: Temporary route title position, relocate somewhere else
const ROUTE_TITLES = { admin: 'Admin', quiz: 'Test' };

function AdminPage({ route, children }) {
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

AdminPage.propTypes = {
  route: Types.object.isRequired,
  children: Types.element,
};

export default AdminPage;
