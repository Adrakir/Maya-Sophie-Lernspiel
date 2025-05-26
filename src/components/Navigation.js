import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="main-navigation">
      <div className="nav-logo">
        <Link to="/" onClick={closeMenu}>
          <span className="logo-text">Maya & Sophie</span>
        </Link>
      </div>
      
      <button className="mobile-menu-button" onClick={toggleMenu}>
        <span className={`menu-icon ${isMenuOpen ? 'open' : ''}`}></span>
      </button>
      
      <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/" onClick={closeMenu}>Home</Link>
        </li>
        <li>
          <Link to="/reading" onClick={closeMenu}>Lesen lernen</Link>
        </li>
        <li>
          <Link to="/games" onClick={closeMenu}>Spiele</Link>
        </li>
        <li>
          <Link to="/daily-learning" onClick={closeMenu}>Tägliches Lernen</Link>
        </li>
        <li>
          <Link to="/photos" onClick={closeMenu}>Fotos</Link>
        </li>
        <li>
          <Link to="/help" onClick={closeMenu}>Hilfe</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;