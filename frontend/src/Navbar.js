import React from 'react';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <span className="navbar-title">Password App</span>
      <ul className="navbar-links">
        <li><a href="#profile">Profile</a></li>
        <li><button className="logout-btn" onClick={onLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
