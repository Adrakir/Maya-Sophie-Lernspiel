import React, { useState, useEffect } from 'react';
import './LearningGames.css';

const AlphabetGame = ({ onCorrectAnswer, onIncorrectAnswer }) => {
  const [gameMode, setGameMode] = useState('letterRecognition'); // 'letterRecognition' oder 'wordFinding'
  const [currentLetter, setCurrentLetter] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [disableOptions, setDisableOptions] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Alphabet und Wörter für das Spiel
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const wordsByLetter = {
    'A': ['Apfel', 'Auto', 'Ananas', 'Affe'],
    'B': ['Ball', 'Banane', 'Baum', 'Buch'],
    'C': ['Computer', 'Camping', 'Clown', 'Cent'],
    'D': ['Dino', 'Dach', 'Drache', 'Dose'],
    'E': ['Elefant', 'Eis', 'Ente', 'Esel'],
    'F': ['Fisch', 'Frosch', 'Fuchs', 'Feuer'],
    'G': ['Giraffe', 'Garten', 'Gabel', 'Gras'],
    'H': ['Hund', 'Haus', 'Hand', 'Hase'],
    'I': ['Igel', 'Insel', 'Iglu', 'Insekt'],
    'J': ['Jacke', 'Junge', 'Joghurt', 'Joker'],
    'K': ['Katze', 'Kuh', 'Kuchen', 'König'],
    'L': ['Löwe', 'Lampe', 'Limo', 'Luft'],
    'M': ['Maus', 'Mond', 'Mama', 'Milch'],
    'N': ['Nase', 'Nest', 'Nudel', 'Nacht'],
    'O': ['Obst', 'Ohr', 'Oma', 'Ordner'],
    'P': ['Papagei', 'Pizza', 'Panda', 'Puppe'],
    'Q': ['Qualle', 'Quark', 'Quelle', 'Quiz'],
    'R': ['Regen', 'Rakete', 'Radio', 'Rose'],
    'S': ['Sonne', 'Schuh', 'Schaf', 'Sand'],
    'T': ['Tiger', 'Tisch', 'Teddy', 'Tasche'],
    'U': ['Uhr', 'Ufo', 'Unterhose', 'Umbrella'],
    'V': ['Vogel', 'Vase', 'Vampir', 'Vulkan'],
    'W': ['Wal', 'Wolke', 'Wasser', 'Wurm'],
    'X': ['Xylophon', 'X-Ray', 'Xerox', 'X-Men'],
    'Y': ['Yacht', 'Yak', 'Yoga', 'Yeti'],
    'Z': ['Zebra', 'Zahn', 'Zug', 'Zoo']
  };

  // Neue Frage generieren
  const generateQuestion = () => {
    setDisableOptions(false);
    
    if (gameMode === 'letterRecognition') {
      // Zufälligen Buchstaben auswählen
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      const letter = alphabet[randomIndex];
      
      // Optionen für das Quiz vorbereiten (4 Buchstaben, einer ist richtig)
      let optionLetters = [letter];
      
      while (optionLetters.length < 4) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!optionLetters.includes(randomLetter)) {
          optionLetters.push(randomLetter);
        }
      }
      
      // Optionen mischen
      optionLetters = optionLetters.sort(() => Math.random() - 0.5);
      
      setCurrentLetter(letter);
      setOptions(optionLetters);
      setCorrectAnswer(letter);
      
    } else if (gameMode === 'wordFinding') {
      // Zufälligen Buchstaben auswählen
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      const letter = alphabet[randomIndex];
      
      // Optionen für das Quiz vorbereiten (4 Wörter, eines beginnt mit dem richtigen Buchstaben)
      const correctWord = wordsByLetter[letter][Math.floor(Math.random() * wordsByLetter[letter].length)];
      let optionWords = [correctWord];
      
      // 3 falsche Wörter hinzufügen, die mit anderen Buchstaben beginnen
      while (optionWords.length < 4) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (randomLetter !== letter && wordsByLetter[randomLetter]) {
          const randomWord = wordsByLetter[randomLetter][Math.floor(Math.random() * wordsByLetter[randomLetter].length)];
          if (!optionWords.includes(randomWord)) {
            optionWords.push(randomWord);
          }
        }
      }
      
      // Optionen mischen
      optionWords = optionWords.sort(() => Math.random() - 0.5);
      
      setCurrentLetter(letter);
      setOptions(optionWords);
      setCorrectAnswer(correctWord);
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
    
    let isCorrect = false;
    
    if (gameMode === 'letterRecognition') {
      isCorrect = selectedAnswer === correctAnswer;
    } else {
      isCorrect = selectedAnswer === correctAnswer;
    }
    
    if (isCorrect) {
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
    <div className="learning-game alphabet-game">
      <h2>ABC lernen</h2>
      
      <div className="game-mode-selector">
        <p>Spielmodus:</p>
        <div className="mode-buttons">
          <button 
            className={`mode-button ${gameMode === 'letterRecognition' ? 'active' : ''}`}
            onClick={() => changeGameMode('letterRecognition')}
          >
            Buchstaben erkennen
          </button>
          <button 
            className={`mode-button ${gameMode === 'wordFinding' ? 'active' : ''}`}
            onClick={() => changeGameMode('wordFinding')}
          >
            Wörter finden
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
          
          <div className="question-container alphabet-question">
            {gameMode === 'letterRecognition' ? (
              <>
                <h3 className="question">Welcher Buchstabe ist das?</h3>
                <div className="current-letter">{currentLetter}</div>
              </>
            ) : (
              <>
                <h3 className="question">Welches Wort beginnt mit dem Buchstaben:</h3>
                <div className="current-letter">{currentLetter}</div>
              </>
            )}
            
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
              <p>Fantastisch! Du kennst dich mit Buchstaben super aus!</p>
            </div>
          )}
          
          {score >= 5 && score < 8 && (
            <div className="result-feedback good">
              <span className="result-emoji">👍</span>
              <p>Gut gemacht! Du lernst die Buchstaben gut!</p>
            </div>
          )}
          
          {score < 5 && (
            <div className="result-feedback keep-trying">
              <span className="result-emoji">💪</span>
              <p>Übe weiter! Mit jedem Versuch wirst du besser!</p>
            </div>
          )}
          
          <button className="kids-button" onClick={resetGame}>
            Nochmal spielen
          </button>
        </div>
      )}
      
      <div className="game-instructions">
        <h4>Spielanleitung:</h4>
        {gameMode === 'letterRecognition' ? (
          <p>Wähle den richtigen Buchstaben aus, der oben angezeigt wird.</p>
        ) : (
          <p>Wähle das Wort, das mit dem angezeigten Buchstaben beginnt.</p>
        )}
        <p>Versuche, so viele Fragen wie möglich richtig zu beantworten!</p>
      </div>
    </div>
  );
};

export default AlphabetGame;