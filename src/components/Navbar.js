import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Ottawa ER Wait Times</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
};

export default Navbar;
