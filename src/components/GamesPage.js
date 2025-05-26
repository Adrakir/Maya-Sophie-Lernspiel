import React, { useState } from 'react';
import TicTacToe from '../games/TicTacToe';
import MemoryGame from '../games/MemoryGame';
import PuzzleGame from '../games/PuzzleGame';
import './GamesPage.css';

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { id: 'tictactoe', name: 'Tic Tac Toe', component: TicTacToe },
    { id: 'memory', name: 'Memory Spiel', component: MemoryGame },
    { id: 'puzzle', name: 'Puzzle', component: PuzzleGame }
  ];

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  return (
    <div className="games-container">
      {!selectedGame ? (
        <>
          <h1>Spiele für Maya und Sophie</h1>
          <p>Wähle ein Spiel aus:</p>
          <div className="game-selection">
            {games.map((game) => (
              <div 
                key={game.id} 
                className="game-card"
                onClick={() => handleGameSelect(game.id)}
              >
                <h3>{game.name}</h3>
                <div className="game-preview">
                  {game.id === 'tictactoe' && <div className="ttt-preview">X O X</div>}
                  {game.id === 'memory' && <div className="memory-preview">🎮</div>}
                  {game.id === 'puzzle' && <div className="puzzle-preview">🧩</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="back-button" onClick={handleBackToMenu}>
            ← Zurück zur Spielauswahl
          </button>
          <div className="game-play-area">
            {games.find(game => game.id === selectedGame)?.component && 
              React.createElement(games.find(game => game.id === selectedGame).component)}
          </div>
        </>
      )}
    </div>
  );
};

export default GamesPage;