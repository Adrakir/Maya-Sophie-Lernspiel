import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Maya & Sophie</h3>
          <p>Eine fröhliche Welt voller Spiele, Lernen und Spaß für Kinder.</p>
        </div>
        
        <div className="footer-section">
          <h3>Schnellzugriff</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/games">Spiele</Link></li>
            <li><Link to="/daily-learning">Tägliches Lernen</Link></li>
            <li><Link to="/photos">Fotogalerie</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Hilfe & Info</h3>
          <ul className="footer-links">
            <li><Link to="/help">Hilfebereich</Link></li>
            <li><Link to="/help#faq">Häufige Fragen</Link></li>
            <li><Link to="/help#contact">Kontakt</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Maya & Sophie. Alle Rechte vorbehalten.</p>
        <p className="version-info">Version 1.0.0</p>
      </div>
    </footer>
  );
};

export default Footer;