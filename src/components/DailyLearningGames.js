import React, { useState, useEffect } from 'react';
import FeedbackMessage from './FeedbackMessage';
import MathGame from './learning/MathGame';
import AlphabetGame from './learning/AlphabetGame';
import ColorGame from './learning/ColorGame';
import './DailyLearningGames.css';

const DailyLearningGames = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [dailyTip, setDailyTip] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const tips = [
    "Vergiss nicht, regelmäßig Pausen zu machen, wenn du lernst!",
    "Trinke viel Wasser, das hilft deinem Gehirn beim Lernen!",
    "Nach dem Lernen ist Bewegung wichtig - spring, tanze oder lauf ein bisschen herum!",
    "Wenn du etwas nicht verstehst, frag einfach - Fragen stellen ist super!",
    "Manchmal ist ein Problem schwer zu lösen. Mach eine kurze Pause und versuche es dann noch einmal!"
  ];

  // Zufälligen Tipp auswählen
  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setDailyTip(randomTip);
  }, []);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  // Feedback-Funktionen
  const showCorrectFeedback = () => {
    const correctMessages = [
      "Super gemacht! 🎉",
      "Wow, du bist großartig! ⭐",
      "Das ist richtig! Du bist ein Schlaukopf! 🧠",
      "Juhuuu! Das war perfekt! 🌈",
      "Toll! Du lernst so schnell! 🚀"
    ];
    
    setFeedbackMessage(correctMessages[Math.floor(Math.random() * correctMessages.length)]);
    setFeedbackType('correct');
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };

  const showIncorrectFeedback = () => {
    const incorrectMessages = [
      "Fast richtig! Versuche es noch einmal! 💪",
      "Keine Sorge, probier's nochmal! Du schaffst das! 🌟",
      "Ups! Aber du bist auf dem richtigen Weg! 🌱",
      "Das ist nicht ganz richtig, aber du lernst mit jedem Versuch! 🧩",
      "Nicht aufgeben! Der nächste Versuch klappt bestimmt! 🌈"
    ];
    
    setFeedbackMessage(incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)]);
    setFeedbackType('incorrect');
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };

  return (
    <div className="daily-learning-container">
      {showFeedback && (
        <FeedbackMessage 
          type={feedbackType} 
          message={feedbackMessage} 
        />
      )}
      
      {!selectedGame ? (
        <>
          <h1 className="learning-title">Tägliche Lernspiele</h1>
          
          <div className="daily-tip">
            <div className="tip-icon">💡</div>
            <p>{dailyTip}</p>
          </div>
          
          <div className="learning-games-grid">
            <div className="learning-game-card">
              <div className="game-card-content">
                <div className="game-icon">🔢</div>
                <h3>Mathe-Spaß</h3>
                <p>Lerne Zahlen und übe einfache Rechenaufgaben. Perfekt für kleine Mathe-Fans!</p>
                <button 
                  className="kids-button"
                  onClick={() => handleGameSelect('math')}
                >
                  Spielen
                </button>
              </div>
            </div>
            
            <div className="learning-game-card">
              <div className="game-card-content">
                <div className="game-icon">🔤</div>
                <h3>ABC lernen</h3>
                <p>Lerne das Alphabet und finde Wörter, die mit bestimmten Buchstaben beginnen.</p>
                <button 
                  className="kids-button"
                  onClick={() => handleGameSelect('alphabet')}
                >
                  Spielen
                </button>
              </div>
            </div>
            
            <div className="learning-game-card">
              <div className="game-card-content">
                <div className="game-icon">🌈</div>
                <h3>Farben-Quiz</h3>
                <p>Lerne Farben zu erkennen und zu benennen mit diesem bunten Spiel.</p>
                <button 
                  className="kids-button"
                  onClick={() => handleGameSelect('colors')}
                >
                  Spielen
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="selected-game-container">
          <button className="back-button" onClick={handleBackToMenu}>
            ← Zurück zur Spielauswahl
          </button>
          
          {selectedGame === 'math' && (
            <MathGame 
              onCorrectAnswer={showCorrectFeedback}
              onIncorrectAnswer={showIncorrectFeedback}
            />
          )}
          
          {selectedGame === 'alphabet' && (
            <AlphabetGame 
              onCorrectAnswer={showCorrectFeedback}
              onIncorrectAnswer={showIncorrectFeedback}
            />
          )}
          
          {selectedGame === 'colors' && (
            <ColorGame 
              onCorrectAnswer={showCorrectFeedback}
              onIncorrectAnswer={showIncorrectFeedback}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DailyLearningGames;