import React, { PropTypes as Types } from 'react';
import { Link } from 'react-router';

function Navbar({ brand, root, children }) {
  return (
    <nav className="navbar navbar-light bg-faded">
      {brand ? <Link className="navbar-brand" to={`/${root}`}>{brand}</Link> : null}
      <ul className="nav navbar-nav">
        {children.map(({ title, path }, i) => (
          <li key={i} className="nav-item">
            <Link className="nav-link" activeClassName="active" to={`/${root ? `${root}/` : ''}${path}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

Navbar.propTypes = {
  children: Types.arrayOf(Types.shape({
    title: Types.string.isRequired,
    path: Types.string.isRequired,
  })),
  root: Types.string,
  brand: Types.oneOfType([Types.string, Types.element]),
};

export default Navbar;
