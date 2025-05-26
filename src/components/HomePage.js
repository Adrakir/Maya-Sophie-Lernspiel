import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Willkommen bei Maya & Sophie!</h1>
          <p>Eine fröhliche Welt voller Spiele, Lernen und Spaß für Kinder.</p>
          <div className="hero-buttons">
            <Link to="/reading" className="kids-button primary-button">
              <span role="img" aria-label="Lesen">📚</span> Lesen lernen
            </Link>
            <Link to="/games" className="kids-button">
              <span role="img" aria-label="Spiele">🎮</span> Spiele entdecken
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://via.placeholder.com/500x300/ffb6c1/000000?text=Maya+und+Sophie" alt="Maya und Sophie" />
        </div>
      </div>

      <h2 className="section-title">Entdecke unsere Welt</h2>
      
      <div className="feature-cards">
        <div className="feature-card spotlight">
          <div className="feature-icon">📖</div>
          <h3>Lesen lernen</h3>
          <p>Entdecke die Welt des Lesens mit spannenden Übungen zu Lauten, Silben, Sichtwörtern und Textverständnis!</p>
          <Link to="/reading" className="feature-link">Zum Lesebereich</Link>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎮</div>
          <h3>Lustige Spiele</h3>
          <p>Spiele klassische Spiele wie Tic Tac Toe, Memory und Puzzle - alles kinderfreundlich gestaltet!</p>
          <Link to="/games" className="feature-link">Zu den Spielen</Link>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>Tägliches Lernen</h3>
          <p>Lerne jeden Tag etwas Neues mit lustigen Quizfragen, Matheübungen und Sprachspielen.</p>
          <Link to="/daily-learning" className="feature-link">Heute lernen</Link>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📸</div>
          <h3>Fotogalerie</h3>
          <p>Schau dir Fotos von Maya und Sophie an und speichere deine eigenen Erinnerungen.</p>
          <Link to="/photos" className="feature-link">Fotos ansehen</Link>
        </div>
      </div>
      
      <div className="reading-journey-section">
        <h2 className="section-title">Deine Lesereise</h2>
        <div className="journey-steps">
          <div className="journey-step">
            <div className="step-number">1</div>
            <div className="step-icon">🔊</div>
            <h3>Laute & Buchstaben</h3>
            <p>Lerne die Laute der Buchstaben kennen - der erste Schritt zum Lesen!</p>
          </div>
          
          <div className="journey-connector">→</div>
          
          <div className="journey-step">
            <div className="step-number">2</div>
            