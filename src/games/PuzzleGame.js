import React, { useState, useEffect } from 'react';
import './PuzzleGame.css';

// Platzhalterbilder für das Puzzle
const placeholderImages = [
  'https://via.placeholder.com/600x400/ffb6c1/000000?text=Puzzle+1',
  'https://via.placeholder.com/600x400/ffd700/000000?text=Puzzle+2',
  'https://via.placeholder.com/600x400/87ceeb/000000?text=Puzzle+3',
];

const PuzzleGame = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [gridSize, setGridSize] = useState({ rows: 3, cols: 3 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  // Puzzle initialisieren
  const initializePuzzle = (image, rows, cols) => {
    const pieces = [];
    const totalPieces = rows * cols;
    
    // Puzzle-Teile erstellen
    for (let i = 0; i < totalPieces - 1; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      pieces.push({
        id: i,
        correctPosition: i,
        currentPosition: i,
        row: row,
        col: col,
        backgroundPosition: `${-100 * col}% ${-100 * row}%`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`
      });
    }
    
    // Leeres Feld hinzufügen
    pieces.push({
      id: totalPieces - 1,
      correctPosition: totalPieces - 1,
      currentPosition: totalPieces - 1,
      row: rows - 1,
      col: cols - 1,
      isEmpty: true
    });
    
    return pieces;
  };

  // Puzzle-Teile mischen
  const shufflePuzzle = (pieces) => {
    const totalPieces = pieces.length;
    let shuffled = [...pieces];
    
    // Fisher-Yates Shuffle Algorithmus
    for (let i = totalPieces - 2; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      
      // Positionen tauschen
      const temp = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = temp;
    }
    
    // Sicherstellen, dass das leere Feld am Ende ist
    const emptyPiece = shuffled.find(piece => piece.isEmpty);
    const lastPiece = shuffled.find(piece => piece.currentPosition === totalPieces - 1);
    
    if (emptyPiece && lastPiece && !lastPiece.isEmpty) {
      const temp = emptyPiece.currentPosition;
      emptyPiece.currentPosition = lastPiece.currentPosition;
      lastPiece.currentPosition = temp;
    }
    
    return shuffled;
  };

  // Puzzle-Teil bewegen
  const movePiece = (pieceIndex) => {
    if (gameCompleted) return;
    
    const piece = puzzlePieces[pieceIndex];
    const emptyPiece = puzzlePieces.find(p => p.isEmpty);
    
    // Aktuelle Positionen im Raster berechnen
    const pieceRow = Math.floor(piece.currentPosition / gridSize.cols);
    const pieceCol = piece.currentPosition % gridSize.cols;
    const emptyRow = Math.floor(emptyPiece.currentPosition / gridSize.cols);
    const emptyCol = emptyPiece.currentPosition % gridSize.cols;
    
    // Überprüfen, ob das Teil neben dem leeren Feld ist
    const isAdjacent = 
      (pieceRow === emptyRow && Math.abs(pieceCol - emptyCol) === 1) || 
      (pieceCol === emptyCol && Math.abs(pieceRow - emptyRow) === 1);
    
    if (isAdjacent) {
      // Positionen tauschen
      const newPieces = [...puzzlePieces];
      const tempPosition = piece.currentPosition;
      
      newPieces[pieceIndex].currentPosition = emptyPiece.currentPosition;
      newPieces[puzzlePieces.indexOf(emptyPiece)].currentPosition = tempPosition;
      
      setPuzzlePieces(newPieces);
      setMoves(moves + 1);
      
      // Überprüfen, ob das Puzzle gelöst ist
      checkPuzzleCompletion(newPieces);
    }
  };

  // Überprüfen, ob das Puzzle gelöst ist
  const checkPuzzleCompletion = (pieces) => {
    const completed = pieces.every(piece => piece.currentPosition === piece.correctPosition);
    
    if (completed) {
      setGameCompleted(true);
      
      // Timer stoppen
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  };

  // Spiel starten
  const startGame = () => {
    if (!selectedImage) return;
    
    // Puzzle initialisieren und mischen
    const initialPieces = initializePuzzle(selectedImage, gridSize.rows, gridSize.cols);
    const shuffledPieces = shufflePuzzle(initialPieces);
    
    setPuzzlePieces(shuffledPieces);
    setGameStarted(true);
    setGameCompleted(false);
    setMoves(0);
    setTime(0);
    
    // Timer starten
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Timer stoppen, wenn die Komponente entfernt wird
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Bildauswahl anzeigen
  const renderImageSelection = () => {
    return (
      <div className="image-selection">
        <h3>Wähle ein Bild für dein Puzzle:</h3>
        <div className="image-options">
          {placeholderImages.map((image, index) => (
            <div 
              key={index}
              className={`image-option ${selectedImage === image ? 'selected' : ''}`}
              onClick={() => setSelectedImage(image)}
            >
              <img src={image} alt={`Puzzle Option ${index + 1}`} />
            </div>
          ))}
        </div>
        
        <div className="difficulty-selection">
          <h3>Wähle den Schwierigkeitsgrad:</h3>
          <div className="difficulty-buttons">
            <button onClick={() => setGridSize({ rows: 3, cols: 3 })}>
              Leicht (3x3)
            </button>
            <button onClick={() => setGridSize({ rows: 4, cols: 4 })}>
              Mittel (4x4)
            </button>
            <button onClick={() => setGridSize({ rows: 5, cols: 5 })}>
              Schwer (5x5)
            </button>
          </div>
        </div>
        
        <button 
          className="start-button"
          onClick={startGame}
          disabled={!selectedImage}
        >
          Spiel starten
        </button>
      </div>
    );
  };

  // Spielfeld anzeigen
  const renderPuzzleBoard = () => {
    // Zeit formatieren
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="puzzle-game-board">
        <div className="game-stats">
          <div className="stat">Züge: {moves}</div>
          <div className="stat">Zeit: {formatTime(time)}</div>
        </div>
        
        <div 
          className="puzzle-board"
          style={{
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
            aspectRatio: `${gridSize.cols} / ${gridSize.rows}`
          }}
        >
          {puzzlePieces.sort((a, b) => a.id - b.id).map((piece, index) => (
            <div
              key={index}
              className={`puzzle-piece ${piece.isEmpty ? 'empty' : ''}`}
              style={!piece.isEmpty ? {
                backgroundImage: `url(${selectedImage})`,
                backgroundPosition: piece.backgroundPosition,
                backgroundSize: piece.backgroundSize,
                order: piece.currentPosition
              } : { order: piece.currentPosition }}
              onClick={() => movePiece(index)}
            />
          ))}
        </div>
        
        {gameCompleted && (
          <div className="completion-message">
            <h3>Glückwunsch! 🎉</h3>
            <p>Du hast das Puzzle in {moves} Zügen und {formatTime(time)} gelöst!</p>
            <button onClick={() => setGameStarted(false)}>Neues Spiel</button>
          </div>
        )}
        
        {!gameCompleted && (
          <button 
            className="reset-button"
            onClick={() => setGameStarted(false)}
          >
            Zurück zur Auswahl
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="puzzle-game">
      <h2>Puzzle</h2>
      
      {!gameStarted ? renderImageSelection() : renderPuzzleBoard()}
      
      <div className="game-instructions">
        <h3>Spielanleitung:</h3>
        <p>Klicke auf ein Puzzleteil neben dem leeren Feld, um es zu bewegen.</p>
        <p>Versuche, das Puzzle so schnell wie möglich zu lösen!</p>
      </div>
    </div>
  );
};

export default PuzzleGame;