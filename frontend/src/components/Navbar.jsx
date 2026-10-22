import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Event<span>Ease</span>
      </Link>
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/admin" className={`admin-link ${isActive('/admin')}`}>
          ⚙ Admin
        </Link>
      </div>
    </nav>
  );
}
