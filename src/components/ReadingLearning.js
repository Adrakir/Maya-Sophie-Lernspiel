import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SyllableGame from './reading/SyllableGame';
import SightWordsGame from './reading/SightWordsGame';
import ReadingComprehension from './reading/ReadingComprehension';
import PhonicsGame from './reading/PhonicsGame';
import LetterRecognition from './reading/LetterRecognition';
import WordBuilding from './reading/WordBuilding';
import './ReadingLearning.css';

/**
 * Hauptkomponente für den Bereich "Lesen lernen"
 * Enthält alle Lernspiele zum Lesenlernen basierend auf didaktischen Methoden
 * für die erste und zweite Klasse des Deutschunterrichts
 */
const ReadingLearning = () => {
  // State für ausgewähltes Spiel
  const [selectedGame, setSelectedGame] = useState(null);

  // Handler für Spielauswahl
  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  // Zurück zum Menü
  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  return (
    <div className="reading-learning-container">
      {!selectedGame ? (
        <>
          <h1 className="reading-title">Lesen lernen</h1>
          <p className="reading-intro">
            Willkommen in deiner Lesewelt! Hier findest du tolle Spiele, die dir helfen, 
            das Lesen zu lernen. Wähle ein Spiel aus und starte dein Leseabenteuer!
          </p>
          
          <div className="reading-games-grid">
            <div className="reading-game-card">
              <div className="game-card-content">
                <div className="game-icon">🔤</div>
                <h3>Buchstaben erkennen</h3>
                <p>Lerne Buchstaben kennen und unterscheide sie voneinander. Der erste Schritt zum Lesen!</p>
                <button 
                  className="kids-button"
                  onClick={() => handleGameSelect('letterRecognition')}
                >
                  Spielen
                </button>
              </div>
            </div>
            
            <div className="reading-game-card">
              <div className="game-card-content">
                <div className="game-icon">🔊</div>
                <h3>Laute & Buchstaben</h3>
                <p>Lerne die Laute der Buchstaben und wie sie Wörter bilden. Wichtig für die Lesetechnik!</p>
                <button 
                  className="kids-button"
                  onClick={() => handleGameSelect('phonics')}
                >
                  Spielen
                </button>
              </div>
            </div>
            
            <div className="reading-game-card">
              <div className="game-card-content">
                <div className="game-icon">🔡</div>
                <h3>Silben-Spaß</h3>
                <p>Lerne Silben zu erkennen und Wörter zu bilden. Perfekt für Leseanfänger!</p>
                <button 
                  className="kids-button"
                  onClick={() => handleGameSelect('syllable')}
                >
                  Spielen
                </button>
              </div>
            </div>
            
            <div className="reading-game-card">
              <div className="game-card-content">
                <div className="game-icon">👁️</div>
                <h3>Sichtwörter</h3>
                <p>Lerne häufige Wörter auf einen Blick zu erkennen. Super für die Lesegeschwindigkeit!</p>
                <button 
                  className="kids-button"
                  onClick={() => handleGameSelect('sightwords')}
                >
                  Spielen
                </button>
              </div>
            </div>
            
            <div className="reading-game-card">
              <div className="game-card-content">
                <div className="game-icon">🧩</div>
                <h3>Wörter bauen</h3>
                <p>Baue eigene Wörter aus Buchstaben und lerne, wie Wörter aufgebaut sind!</p>
                <button 
                  className="kids-button"
                  onClick={() => handleGameSelect('wordBuilding')}
                >
                  Spielen
                </button>
              </div>
            </div>
            
            <div className="reading-game-card">
              <div className="game-card-content">
                <div className="game-icon">📖</div>
                <h3>Lese-Verständnis</h3>
                <p>Lies kleine Geschichten und beantworte Fragen dazu. Ideal für das Textverständnis!</p>
                <button 
                  className="kids-button"
                  onClick={() => handleGameSelect('comprehension')}
                >
                  Spielen
                </button>
              </div>
            </div>
          </div>
          
          <div className="reading-progress">
            <h3>Dein Leseweg</h3>
            <p>Folge diesem Weg, um das Lesen Schritt für Schritt zu lernen:</p>
            <div className="progress-path">
              <div className="progress-step">
                <div className="step-icon">1</div>
                <p>Buchstaben erkennen</p>
              </div>
              <div className="progress-arrow">→</div>
              <div className="progress-step">
                <div className="step-icon">2</div>
                <p>Laute & Buchstaben</p>
              </div>
              <div className="progress-arrow">→</div>
              <div className="progress-step">
                <div className="step-icon">3</div>
                <p>Silben-Spaß</p>
              </div>
              <div className="progress-arrow">→</div>
              <div className="progress-step">
                <div className="step-icon">4</div>
                <p>Sichtwörter</p>
              </div>
              <div className="progress-arrow">→</div>
              <div className="progress-step">
                <div className="step-icon">5</div>
                <p>Wörter bauen</p>
              </div>
              <div className="progress-arrow">→</div>
              <div className="progress-step">
                <div className="step-icon">6</div>
                <p>Lese-Verständnis</p>
              </div>
            </div>
          </div>
          
          <div className="reading-tips">
            <h3>Tipps für Eltern</h3>
            <ul>
              <li>Üben Sie regelmäßig mit Ihrem Kind, am besten täglich für 10-15 Minuten.</li>
              <li>Loben Sie Fortschritte und bleiben Sie geduldig bei Schwierigkeiten.</li>
              <li>Verbinden Sie die digitalen Übungen mit dem Vorlesen echter Bücher.</li>
              <li>Lassen Sie Ihr Kind die Geschwindigkeit bestimmen und drängen Sie nicht.</li>
              <li>Machen Sie das Lesen zu etwas Positivem - es soll Spaß machen!</li>
            </ul>
          </div>
        </>
      ) : (
        <div className="selected-game-container">
          <button className="back-button" onClick={handleBackToMenu}>
            ← Zurück zur Spielauswahl
          </button>
          
          {selectedGame === 'letterRecognition' && <LetterRecognition />}
          {selectedGame === 'phonics' && <PhonicsGame />}
          {selectedGame === 'syllable' && <SyllableGame />}
          {selectedGame === 'sightwords' && <SightWordsGame />}
          {selectedGame === 'wordBuilding' && <WordBuilding />}
          {selectedGame === 'comprehension' && <ReadingComprehension />}
        </div>
      )}
    </div>
  );
};

export default ReadingLearning;