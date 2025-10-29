// src/components/Navbar.js — DEBUG VERSION (paste & save exactly)
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  useEffect(() => {
    console.log('[DEBUG Navbar] mounted — this file is being used');
    const nav = document.querySelector('nav');
    if (nav) nav.dataset.debug = 'navbar-debug-v1';
    return () => console.log('[DEBUG Navbar] unmounted');
  }, []);

  return (
    <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '10px', background: '#fff3' }}>
      <Link to="/">Home</Link>
      <Link to="/trends">Trends</Link>
      <Link to="/admin">Admin </Link>
    </nav>
  );
};

export default Navbar;
