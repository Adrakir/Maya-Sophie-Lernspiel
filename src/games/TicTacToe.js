import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [gameStatus, setGameStatus] = useState('Spieler X ist dran');

  // Gewinnkombinationen
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertikal
    [0, 4, 8], [2, 4, 6]             // diagonal
  ];

  // Überprüfen auf Gewinner
  useEffect(() => {
    const checkWinner = () => {
      for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          setWinner(board[a]);
          setWinningLine(winningCombinations[i]);
          setGameStatus(`Spieler ${board[a]} gewinnt!`);
          return true;
        }
      }
      
      // Unentschieden
      if (!board.includes(null)) {
        setGameStatus('Unentschieden!');
        return true;
      }
      
      // Spiel läuft noch
      setGameStatus(`Spieler ${isXNext ? 'X' : 'O'} ist dran`);
      return false;
    };

    checkWinner();
  }, [board, isXNext]);

  // Feld anklicken
  const handleClick = (index) => {
    // Nicht erlauben, wenn bereits belegt oder Spiel beendet
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Spiel zurücksetzen
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setGameStatus('Spieler X ist dran');
  };

  // Rendering eines Spielfelds
  const renderSquare = (index) => {
    const isWinningSquare = winningLine.includes(index);
    
    return (
      <button 
        className={`square ${isWinningSquare ? 'winning' : ''} ${board[index] ? 'filled' : ''}`} 
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="tic-tac-toe">
      <h2>Tic Tac Toe</h2>
      <div className="status">{gameStatus}</div>
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <button className="reset-button" onClick={resetGame}>
        Neues Spiel
      </button>
      <div className="game-info">
        <h3>Spielanleitung:</h3>
        <p>Klicke auf ein leeres Feld, um deinen Spielstein (X oder O) zu setzen.</p>
        <p>Wer zuerst drei Spielsteine in einer Reihe, Spalte oder Diagonale hat, gewinnt!</p>
      </div>
    </div>
  );
};

export default TicTacToe;