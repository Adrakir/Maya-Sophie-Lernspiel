import React, { useState, useEffect } from 'react';
import './LearningGames.css';

const ColorGame = ({ onCorrectAnswer, onIncorrectAnswer }) => {
  const [gameMode, setGameMode] = useState('nameToColor'); // 'nameToColor' oder 'colorToName'
  const [currentColor, setCurrentColor] = useState('');
  const [currentColorName, setCurrentColorName] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [disableOptions, setDisableOptions] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Farben für das Spiel
  const colors = [
    { name: 'Rot', hex: '#FF0000' },
    { name: 'Blau', hex: '#0000FF' },
    { name: 'Grün', hex: '#00FF00' },
    { name: 'Gelb', hex: '#FFFF00' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Lila', hex: '#800080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Braun', hex: '#A52A2A' },
    { name: 'Schwarz', hex: '#000000' },
    { name: 'Weiß', hex: '#FFFFFF' }
  ];

  // Neue Frage generieren
  const generateQuestion = () => {
    setDisableOptions(false);
    
    // Zufällige Farbe auswählen
    const randomIndex = Math.floor(Math.random() * colors.length);
    const color = colors[randomIndex];
    
    if (gameMode === 'nameToColor') {
      // Farbname anzeigen, nach der Farbe fragen
      setCurrentColorName(color.name);
      
      // Optionen (4 Farben, eine richtig)
      let colorOptions = [color.hex];
      
      while (colorOptions.length < 4) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)].hex;
        if (!colorOptions.includes(randomColor)) {
          colorOptions.push(randomColor);
        }
      }
      
      // Optionen mischen
      colorOptions = colorOptions.sort(() => Math.random() - 0.5);
      
      setOptions(colorOptions);
      setCorrectAnswer(color.hex);
      
    } else if (gameMode === 'colorToName') {
      // Farbe anzeigen, nach dem Namen fragen
      setCurrentColor(color.hex);
      
      // Optionen (4 Namen, einer richtig)
      let nameOptions = [color.name];
      
      while (nameOptions.length < 4) {
        const randomName = colors[Math.floor(Math.random() * colors.length)].name;
        if (!nameOptions.includes(randomName)) {
          nameOptions.push(randomName);
        }
      }
      
      // Optionen mischen
      nameOptions = nameOptions.sort(() => Math.random() - 0.5);
      
      setOptions(nameOptions);
      setCorrectAnswer(color.name);
    }
  };

  // Beim ersten Laden und bei Änderung des Spielmodus Frage generieren
  useEffect(() => {
    generateQuestion();
  }, [gameMode]);

  // Antwort überprüfen
  const checkAnswer = (selectedAnswer) => {
    setDisableOptions(true);
    setQuestionsAsked(questionsAsked + 1);
    
    if (selectedAnswer === correctAnswer) {
      onCorrectAnswer();
      setScore(score + 1);
      
      // Nach kurzer Verzögerung nächste Frage
      setTimeout(() => {
        if (questionsAsked + 1 >= 10) {
          setShowResults(true);
        } else {
          generateQuestion();
        }
      }, 1500);
    } else {
      onIncorrectAnswer();
      
      // Nach längerer Verzögerung nächste Frage
      setTimeout(() => {
        if (questionsAsked + 1 >= 10) {
          setShowResults(true);
        } else {
          generateQuestion();
        }
      }, 2000);
    }
  };

  // Spiel zurücksetzen
  const resetGame = () => {
    setScore(0);
    setQuestionsAsked(0);
    setShowResults(false);
    generateQuestion();
  };

  // Spielmodus ändern
  const changeGameMode = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  return (
    <div className="learning-game color-game">
      <h2>Farben-Quiz</h2>
      
      <div className="game-mode-selector">
        <p>Spielmodus:</p>
        <div className="mode-buttons">
          <button 
            className={`mode-button ${gameMode === 'nameToColor' ? 'active' : ''}`}
            onClick={() => changeGameMode('nameToColor')}
          >
            Name zu Farbe
          </button>
          <button 
            className={`mode-button ${gameMode === 'colorToName' ? 'active' : ''}`}
            onClick={() => changeGameMode('colorToName')}
          >
            Farbe zu Name
          </button>
        </div>
      </div>
      
      {!showResults ? (
        <>
          <div className="game-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(questionsAsked / 10) * 100}%` }}
              ></div>
            </div>
            <p>Frage {questionsAsked + 1} von 10</p>
          </div>
          
          <div className="game-score">
            <p>Punkte: {score}</p>
          </div>
          
          <div className="question-container color-question">
            {gameMode === 'nameToColor' ? (
              <>
                <h3 className="question">Welche Farbe ist {currentColorName}?</h3>
                <div className="color-options">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      className="color-option"
                      style={{ backgroundColor: option }}
                      onClick={() => !disableOptions && checkAnswer(option)}
                      disabled={disableOptions}
                    ></button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="question">Wie heißt diese Farbe?</h3>
                <div 
                  className="current-color"
                  style={{ backgroundColor: currentColor }}
                ></div>
                <div className="answer-options">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      className="answer-option"
                      onClick={() => !disableOptions && checkAnswer(option)}
                      disabled={disableOptions}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="game-results">
          <h3>Spielergebnis</h3>
          <div className="result-score">
            <span className="score-number">{score}</span>
            <span className="score-text">von 10 Punkten</span>
          </div>
          
          {score >= 8 && (
            <div className="result-feedback great">
              <span className="result-emoji">🌟</span>
              <p>Fantastisch! Du kennst die Farben wirklich gut!</p>
            </div>
          )}
          
          {score >= 5 && score < 8 && (
            <div className="result-feedback good">
              <span className="result-emoji">👍</span>
              <p>Gut gemacht! Du hast ein gutes Auge für Farben!</p>
            </div>
          )}
          
          {score < 5 && (
            <div className="result-feedback keep-trying">
              <span className="result-emoji">💪</span>
              <p>Übe weiter! Mit jedem Versuch lernst du die Farben besser kennen!</p>
            </div>
          )}
          
          <button className="kids-button" onClick={resetGame}>
            Nochmal spielen
          </button>
        </div>
      )}
      
      <div className="game-instructions">
        <h4>Spielanleitung:</h4>
        {gameMode === 'nameToColor' ? (
          <p>Wähle die Farbe aus, die zum angezeigten Namen passt.</p>
        ) : (
          <p>Wähle den Namen, der zur angezeigten Farbe passt.</p>
        )}
        <p>Versuche, so viele Fragen wie möglich richtig zu beantworten!</p>
      </div>
    </div>
  );
};

export default ColorGame;