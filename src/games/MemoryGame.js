import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(null); // null, 'easy', 'medium', 'hard'

  // Emoji-Paare für das Spiel
  const emojis = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🦄', '🦋', '🐢', '🐙', '🦀', '🦞', '🦑', '🐠'
  ];

  // Karten basierend auf der Schwierigkeit erstellen
  const initializeGame = (level) => {
    let numberOfPairs;
    
    switch(level) {
      case 'easy':
        numberOfPairs = 6;
        break;
      case 'medium':
        numberOfPairs = 9;
        break;
      case 'hard':
        numberOfPairs = 12;
        break;
      default:
        numberOfPairs = 6;
    }
    
    // Zufällige Emojis auswählen
    const selectedEmojis = emojis.sort(() => 0.5 - Math.random()).slice(0, numberOfPairs);
    
    // Paare erstellen und mischen
    let newCards = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji: emoji,
        flipped: false,
        matched: false
      }));
    
    setCards(newCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameOver(false);
    setDifficulty(level);
  };

  // Überprüfen auf Spielende
  useEffect(() => {
    if (matchedPairs.length > 0 && matchedPairs.length === cards.length / 2) {
      setGameOver(true);
    }
  }, [matchedPairs, cards]);

  // Karte umdrehen
  const flipCard = (index) => {
    // Nicht erlauben, wenn bereits 2 Karten umgedreht oder Karte bereits umgedreht/gematcht
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || 
        cards[index].matched) return;
    
    // Karte umdrehen
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    // Wenn zwei Karten umgedreht, Paar überprüfen
    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // Paar gefunden
        setMatchedPairs([...matchedPairs, cards[firstIndex].emoji]);
        
        // Zurücksetzen für nächsten Zug
        setTimeout(() => {
          setFlippedIndices([]);
        }, 800);
      } else {
        // Kein Paar, umdrehen nach kurzer Zeit
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  // Spielergebnis anzeigen
  const renderResult = () => {
    if (!gameOver) return null;
    
    let message;
    if (moves <= cards.length / 2 + 2) {
      message = "Fantastisch! 🌟 Du hast ein unglaubliches Gedächtnis!";
    } else if (moves <= cards.length / 2 + 5) {
      message = "Super gemacht! 🎉 Das war richtig gut!";
    } else {
      message = "Gut gemacht! 👏 Versuche es noch einmal für eine bessere Punktzahl!";
    }
    
    return (
      <div className="game-result">
        <h3>Spiel beendet!</h3>
        <p>{message}</p>
        <p>Du hast {moves} Züge gebraucht, um alle Paare zu finden.</p>
        <button onClick={() => initializeGame(difficulty)} className="play-again-button">
          Nochmal spielen
        </button>
      </div>
    );
  };

  // Schwierigkeitsauswahl
  if (!difficulty) {
    return (
      <div className="memory-game difficulty-selection">
        <h2>Memory Spiel</h2>
        <p>Wähle einen Schwierigkeitsgrad:</p>
        <div className="difficulty-buttons">
          <button onClick={() => initializeGame('easy')}>Leicht (6 Paare)</button>
          <button onClick={() => initializeGame('medium')}>Mittel (9 Paare)</button>
          <button onClick={() => initializeGame('hard')}>Schwer (12 Paare)</button>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-game">
      <h2>Memory Spiel</h2>
      <div className="game-info">
        <p>Züge: {moves}</p>
        <p>Gefundene Paare: {matchedPairs.length} / {cards.length / 2}</p>
      </div>
      
      {gameOver ? renderResult() : (
        <>
          <div className={`card-grid ${difficulty}`}>
            {cards.map((card, index) => (
              <div 
                key={index}
                className={`card ${flippedIndices.includes(index) ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                onClick={() => flipCard(index)}
              >
                <div className="card-back">?</div>
                <div className="card-front">{card.emoji}</div>
              </div>
            ))}
          </div>
          
          <button onClick={() => initializeGame(difficulty)} className="reset-button">
            Neues Spiel
          </button>
        </>
      )}
      
      <div className="game-help">
        <h3>Spielanleitung:</h3>
        <p>Finde alle Paare, indem du die Karten umdrehst.</p>
        <p>Versuche, es in so wenigen Zügen wie möglich zu schaffen!</p>
      </div>
    </div>
  );
};

export default MemoryGame;