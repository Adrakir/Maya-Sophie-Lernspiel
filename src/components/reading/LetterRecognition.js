import React, { useState, useEffect } from 'react';
import './ReadingGames.css';

/**
 * Spiel zur Buchstabenerkennung
 * Zielgruppe: Kinder, die gerade anfangen, Buchstaben zu lernen
 * 
 * @param {Object} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const LetterRecognition = () => {
  // Spielzustände
  const [level, setLevel] = useState(1);
  const [gameMode, setGameMode] = useState('uppercase'); // 'uppercase', 'lowercase', 'both'
  const [currentLetter, setCurrentLetter] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [disableOptions, setDisableOptions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Buchstaben-Datensätze
  const letterData = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    lowercase: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    special: 'ÄÖÜäöüß'.split('')
  };

  // Feedback für richtige und falsche Antworten
  const showCorrectFeedback = () => {
    const correctMessages = [
      "Super gemacht! 🎉",
      "Richtig! Du kennst diesen Buchstaben! ⭐",
      "Toll! Du bist ein Buchstaben-Meister! 🧠",
      "Juhuuu! Das war perfekt! 🌈",
      "Richtig! Du bist ein Lese-Profi! 🚀"
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
      "Fast richtig! Schau genau hin und versuch es noch einmal! 💪",
      "Hmm, das ist nicht ganz richtig. Probier's noch einmal! 🌟",
      "Dieser Buchstabe ist knifflig! Versuch es noch einmal! 🌱",
      "Nicht ganz! Achte auf die Form des Buchstabens! 🧩",
      "Fast! Schau dir den Buchstaben noch einmal an! 🌈"
    ];
    
    setFeedbackMessage(incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)]);
    setFeedbackType('incorrect');
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };

  // Neue Frage generieren
  const generateQuestion = () => {
    setDisableOptions(false);
    
    // Verfügbare Buchstaben je nach Spielmodus und Level
    let availableLetters = [];
    
    if (gameMode === 'uppercase') {
      availableLetters = letterData.uppercase;
    } else if (gameMode === 'lowercase') {
      availableLetters = letterData.lowercase;
    } else if (gameMode === 'both') {
      availableLetters = [...letterData.uppercase, ...letterData.lowercase];
    }
    
    // Für Level 2 und 3 auch Umlaute hinzufügen
    if (level >= 2) {
      availableLetters = [...availableLetters, ...letterData.special];
    }
    
    // Zufälligen Buchstaben auswählen
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    const selectedLetter = availableLetters[randomIndex];
    
    setCurrentLetter(selectedLetter);
    setCorrectAnswer(selectedLetter);
    
    // Optionen erstellen (1 richtig, 3 falsch)
    let letterOptions = [selectedLetter];
    
    // Je nach Level ähnlichere oder verschiedenere Buchstaben als Optionen
    while (letterOptions.length < 4) {
      const randomLetterIndex = Math.floor(Math.random() * availableLetters.length);
      const randomLetter = availableLetters[randomLetterIndex];
      
      // Für Level 3: Sicherstellen, dass wir ähnliche Buchstaben als Ablenkung haben
      if (level === 3) {
        const similarLetters = getSimilarLetters(selectedLetter);
        
        if (similarLetters.length > 0 && letterOptions.length < 3) {
          const similarLetter = similarLetters[Math.floor(Math.random() * similarLetters.length)];
          if (!letterOptions.includes(similarLetter)) {
            letterOptions.push(similarLetter);
            continue;
          }
        }
      }
      
      if (!letterOptions.includes(randomLetter)) {
        letterOptions.push(randomLetter);
      }
    }
    
    // Optionen mischen
    letterOptions = letterOptions.sort(() => Math.random() - 0.5);
    setOptions(letterOptions);
  };

  // Ähnliche Buchstaben finden (für höhere Schwierigkeitsgrade)
  const getSimilarLetters = (letter) => {
    const similarityMap = {
      'B': ['P', 'R', 'D', 'b'],
      'D': ['B', 'O', 'P', 'd'],
      'E': ['F', 'B', 'e'],
      'F': ['E', 'P', 'f'],
      'G': ['C', 'O', 'g'],
      'H': ['N', 'M', 'h'],
      'I': ['J', 'L', 'T', 'i'],
      'J': ['I', 'L', 'j'],
      'K': ['R', 'X', 'k'],
      'L': ['I', 'J', 'l'],
      'M': ['N', 'W', 'm'],
      'N': ['M', 'H', 'n'],
      'O': ['Q', 'D', 'G', 'o'],
      'P': ['B', 'R', 'p'],
      'Q': ['O', 'G', 'q'],
      'R': ['P', 'B', 'r'],
      'S': ['Z', '5', 's'],
      'T': ['I', 'Y', 't'],
      'U': ['V', 'Y', 'u'],
      'V': ['U', 'W', 'v'],
      'W': ['M', 'V', 'w'],
      'X': ['K', 'Y', 'x'],
      'Y': ['T', 'X', 'y'],
      'Z': ['S', '2', 'z'],
      'a': ['e', 'o', 'A'],
      'b': ['d', 'p', 'B'],
      'c': ['e', 'o', 'C'],
      'd': ['b', 'p', 'D'],
      'e': ['a', 'c', 'E'],
      'f': ['t', 'r', 'F'],
      'g': ['q', 'p', 'G'],
      'h': ['n', 'b', 'H'],
      'i': ['j', 'l', 'I'],
      'j': ['i', 'l', 'J'],
      'k': ['h', 'x', 'K'],
      'l': ['i', 'j', 'L'],
      'm': ['n', 'w', 'M'],
      'n': ['m', 'h', 'N'],
      'o': ['a', 'e', 'O'],
      'p': ['b', 'q', 'P'],
      'q': ['p', 'g', 'Q'],
      'r': ['n', 'v', 'R'],
      's': ['z', 'c', 'S'],
      't': ['f', 'l', 'T'],
      'u': ['v', 'n', 'U'],
      'v': ['u', 'w', 'V'],
      'w': ['v', 'm', 'W'],
      'x': ['y', 'k', 'X'],
      'y': ['v', 'g', 'Y'],
      'z': ['s', 'x', 'Z'],
      'Ä': ['A', 'Ö', 'ä'],
      'Ö': ['O', 'Ä', 'ö'],
      'Ü': ['U', 'Y', 'ü'],
      'ä': ['a', 'ö', 'Ä'],
      'ö': ['o', 'ä', 'Ö'],
      'ü': ['u', 'y', 'Ü'],
      'ß': ['B', 's', 'z'],
    };
    
    return similarityMap[letter] || [];
  };

  // Beim ersten Laden und bei Änderung des Levels oder Modus Frage generieren
  useEffect(() => {
    generateQuestion();
  }, [level, gameMode]);

  // Antwort überprüfen
  const checkAnswer = (selectedAnswer) => {
    setDisableOptions(true);
    setQuestionsAsked(questionsAsked + 1);
    
    if (selectedAnswer === correctAnswer) {
      showCorrectFeedback();
      setScore(score + 1);
      
      // Nach kurzer Verzögerung nächste Frage
      setTimeout(() => {
        if (questionsAsked + 1 >= 10) {
          setShowResults(true);
        } else {
          generateQuestion();
        }
      }, 2000);
    } else {
      showIncorrectFeedback();
      
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

  // Level ändern
  const changeLevel = (newLevel) => {
    setLevel(newLevel);
    resetGame();
  };

  // Spielmodus ändern
  const changeGameMode = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  return (
    <div className="reading-game letter-recognition-game">
      <h2>Buchstaben erkennen</h2>
      
      {showFeedback && (
        <div className={`feedback-message ${feedbackType}`}>
          <div className="feedback-content">
            {feedbackType === 'correct' && <span className="feedback-icon">✨</span>}
            {feedbackType === 'incorrect' && <span className="feedback-icon">💪</span>}
            <p>{feedbackMessage}</p>
          </div>
        </div>
      )}
      
      <div className="game-controls">
        <div className="level-selector">
          <p>Schwierigkeitsgrad:</p>
          <div className="level-buttons">
            <button 
              className={`level-button ${level === 1 ? 'active' : ''}`}
              onClick={() => changeLevel(1)}
            >
              Stufe 1
            </button>
            <button 
              className={`level-button ${level === 2 ? 'active' : ''}`}
              onClick={() => changeLevel(2)}
            >
              Stufe 2
            </button>
            <button 
              className={`level-button ${level === 3 ? 'active' : ''}`}
              onClick={() => changeLevel(3)}
            >
              Stufe 3
            </button>
          </div>
        </div>
        
        <div className="mode-selector">
          <p>Buchstabenform:</p>
          <div className="mode-buttons">
            <button 
              className={`mode-button ${gameMode === 'uppercase' ? 'active' : ''}`}
              onClick={() => changeGameMode('uppercase')}
            >
              Großbuchstaben
            </button>
            <button 
              className={`mode-button ${gameMode === 'lowercase' ? 'active' : ''}`}
              onClick={() => changeGameMode('lowercase')}
            >
              Kleinbuchstaben
            </button>
            <button 
              className={`mode-button ${gameMode === 'both' ? 'active' : ''}`}
              onClick={() => changeGameMode('both')}
            >
              Gemischt
            </button>
          </div>
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
          
          <div className="question-container">
            <h3 className="question">Welcher Buchstabe ist das?</h3>
            
            <div className="current-letter-display">
              <span className="current-letter">{currentLetter}</span>
            </div>
            
            <div className="answer-options">
              {options.map((option, index) => (
                <button
                  key={index}
                  className="answer-option letter-option"
                  onClick={() => !disableOptions && checkAnswer(option)}
                  disabled={disableOptions}
                >
                  {option}
                </button>
              ))}
            </div>
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
              <p>Fantastisch! Du kennst die Buchstaben wirklich gut!</p>
            </div>
          )}
          
          {score >= 5 && score < 8 && (
            <div className="result-feedback good">
              <span className="result-emoji">👍</span>
              <p>Gut gemacht! Du lernst die Buchstaben sehr gut!</p>
            </div>
          )}
          
          {score < 5 && (
            <div className="result-feedback keep-trying">
              <span className="result-emoji">💪</span>
              <p>Übe weiter! Mit jedem Versuch lernst du die Buchstaben besser kennen!</p>
            </div>
          )}
          
          <button className="kids-button" onClick={resetGame}>
            Nochmal spielen
          </button>
        </div>
      )}
      
      <div className="game-instructions">
        <h4>Spielanleitung:</h4>
        <p>Schau dir den angezeigten Buchstaben an und wähle ihn aus den Optionen aus.</p>
        <p>Achte genau auf die Form jedes Buchstabens!</p>
        <p>Tipp: Manche Buchstaben sehen ähnlich aus. Schau genau hin!</p>
      </div>
    </div>
  );
};

export default LetterRecognition;