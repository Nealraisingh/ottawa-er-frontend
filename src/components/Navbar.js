import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '10px' }}>
      <Link to="/">Home</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/trends">Trends</Link>
    </nav>
  );
};

export default Navbar;
