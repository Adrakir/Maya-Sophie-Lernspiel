import React, { useState, useEffect } from 'react';
import './ReadingGames.css';

const SightWordsGame = () => {
  const [level, setLevel] = useState(1);
  const [gameMode, setGameMode] = useState('identify'); // 'identify' oder 'complete'
  const [currentWord, setCurrentWord] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [wordImage, setWordImage] = useState('');
  const [hiddenWordParts, setHiddenWordParts] = useState({});
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [disableOptions, setDisableOptions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5); // Sekunden für die Wortanzeige

  // Datenbank der Sichtwörter nach Schwierigkeitsgrad
  const sightWordsData = {
    1: [
      { word: 'ich', image: '👤', meaning: 'Person, die spricht' },
      { word: 'du', image: '👉', meaning: 'Person, die angesprochen wird' },
      { word: 'wir', image: '👨‍👩‍👧‍👦', meaning: 'Mehrere Personen zusammen' },
      { word: 'der', image: '👨', meaning: 'Männlicher Artikel' },
      { word: 'die', image: '👩', meaning: 'Weiblicher Artikel' },
      { word: 'das', image: '🧸', meaning: 'Sächlicher Artikel' },
      { word: 'und', image: '🔗', meaning: 'Verbindung zwischen Dingen' },
      { word: 'ist', image: '=', meaning: 'Gleichheit oder Zustand' },
      { word: 'ein', image: '1️⃣', meaning: 'Unbestimmter Artikel' },
      { word: 'eine', image: '1️⃣', meaning: 'Unbestimmter weiblicher Artikel' },
    ],
    2: [
      { word: 'haben', image: '✋', meaning: 'Etwas besitzen' },
      { word: 'sein', image: '🧍', meaning: 'Existieren' },
      { word: 'gehen', image: '🚶', meaning: 'Sich fortbewegen' },
      { word: 'kommen', image: '🏃', meaning: 'Sich nähern' },
      { word: 'machen', image: '🛠️', meaning: 'Etwas tun oder herstellen' },
      { word: 'sehen', image: '👁️', meaning: 'Mit den Augen wahrnehmen' },
      { word: 'hören', image: '👂', meaning: 'Mit den Ohren wahrnehmen' },
      { word: 'spielen', image: '🎮', meaning: 'Sich vergnügen' },
      { word: 'lernen', image: '📚', meaning: 'Wissen aneignen' },
      { word: 'essen', image: '🍽️', meaning: 'Nahrung zu sich nehmen' },
    ],
    3: [
      { word: 'Schule', image: '🏫', meaning: 'Ort zum Lernen' },
      { word: 'Familie', image: '👨‍👩‍👧‍👦', meaning: 'Eltern und Kinder' },
      { word: 'Freund', image: '🤝', meaning: 'Person, die man mag' },
      { word: 'Lehrer', image: '👨‍🏫', meaning: 'Person, die unterrichtet' },
      { word: 'Haus', image: '🏠', meaning: 'Gebäude zum Wohnen' },
      { word: 'Stadt', image: '🏙️', meaning: 'Großer Wohnort mit vielen Menschen' },
      { word: 'Wasser', image: '💧', meaning: 'Flüssigkeit zum Trinken' },
      { word: 'Buch', image: '📕', meaning: 'Zum Lesen' },
      { word: 'Tier', image: '🐾', meaning: 'Lebewesen, kein Mensch' },
      { word: 'Zeit', image: '⏰', meaning: 'Vergehen von Sekunden, Minuten, Stunden' },
    ]
  };

  // Feedback für richtige und falsche Antworten
  const showCorrectFeedback = () => {
    const correctMessages = [
      "Super gemacht! 🎉",
      "Richtig! Du kennst dieses Wort! ⭐",
      "Toll! Dein Wortschatz wächst! 🧠",
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
      "Hmm, das stimmt nicht ganz. Probier's noch einmal! 🌟",
      "Dieses Wort ist schwierig! Versuch es noch einmal! 🌱",
      "Nicht ganz! Achte auf die Buchstaben! 🧩",
      "Fast! Schau dir das Wort noch einmal an! 🌈"
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
    clearTimeout(timer);
    setTimeLeft(5);
    
    // Alle verfügbaren Daten für das aktuelle Level holen
    let availableData = [];
    for (let i = 1; i <= level; i++) {
      availableData = [...availableData, ...sightWordsData[i]];
    }
    
    // Zufälliges Wort auswählen
    const randomIndex = Math.floor(Math.random() * availableData.length);
    const selectedWord = availableData[randomIndex];
    
    setCurrentWord(selectedWord.word);
    setWordImage(selectedWord.image);
    
    if (gameMode === 'identify') {
      // Modus: Wort identifizieren (Bild wird gezeigt, Wort soll erkannt werden)
      
      // Optionen: das richtige Wort und 3 falsche Wörter
      let wordOptions = [selectedWord.word];
      
      while (wordOptions.length < 4) {
        const randomWordIndex = Math.floor(Math.random() * availableData.length);
        if (randomWordIndex !== randomIndex && !wordOptions.includes(availableData[randomWordIndex].word)) {
          wordOptions.push(availableData[randomWordIndex].word);
        }
      }
      
      // Optionen mischen
      wordOptions = wordOptions.sort(() => Math.random() - 0.5);
      setOptions(wordOptions);
      setCorrectAnswer(selectedWord.word);
      
    } else if (gameMode === 'complete') {
      // Modus: Wort vervollständigen (Teile des Wortes sind ausgeblendet)
      
      const wordLength = selectedWord.word.length;
      const hiddenPartCount = Math.min(Math.floor(wordLength / 2), 2); // Max 2 Teile verstecken
      
      // Zufällige Positionen zum Verstecken auswählen
      let hiddenPositions = {};
      let count = 0;
      
      while (count < hiddenPartCount) {
        const pos = Math.floor(Math.random() * wordLength);
        if (!hiddenPositions[pos]) {
          hiddenPositions[pos] = true;
          count++;
        }
      }
      
      setHiddenWordParts(hiddenPositions);
      
      // Optionen für die versteckten Buchstaben erstellen
      let letterOptions = [];
      
      // Die richtigen Buchstaben hinzufügen
      Object.keys(hiddenPositions).forEach(pos => {
        letterOptions.push(selectedWord.word[pos]);
      });
      
      // Weitere zufällige Buchstaben hinzufügen
      const alphabet = 'abcdefghijklmnopqrstuvwxyzäöü'.split('');
      
      while (letterOptions.length < 4) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!letterOptions.includes(randomLetter)) {
          letterOptions.push(randomLetter);
        }
      }
      
      // Optionen mischen
      letterOptions = letterOptions.sort(() => Math.random() - 0.5);
      setOptions(letterOptions);
      
      // Korrekte Antwort ist der erste versteckte Buchstabe (für die Einfachheit)
      const firstHiddenPos = Object.keys(hiddenPositions)[0];
      setCorrectAnswer(selectedWord.word[firstHiddenPos]);
    }
    
    // Timer starten, der das Wort nach einigen Sekunden ausblendet (nur für 'identify' Modus)
    if (gameMode === 'identify') {
      const newTimer = setTimeout(() => {
        // Nächste Frage nach Zeitablauf
        generateQuestion();
      }, 5000);
      
      setTimer(newTimer);
      
      // Countdown aktualisieren
      const countdownInterval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  // Beim ersten Laden und bei Änderung des Levels oder Modus Frage generieren
  useEffect(() => {
    generateQuestion();
    
    // Cleanup beim Unmount
    return () => {
      clearTimeout(timer);
    };
  }, [level, gameMode]);

  // Antwort überprüfen
  const checkAnswer = (selectedAnswer) => {
    setDisableOptions(true);
    clearTimeout(timer);
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
    <div className="reading-game sightwords-game">
      <h2>Sichtwörter</h2>
      
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
          <p>Spielmodus:</p>
          <div className="mode-buttons">
            <button 
              className={`mode-button ${gameMode === 'identify' ? 'active' : ''}`}
              onClick={() => changeGameMode('identify')}
            >
              Wörter erkennen
            </button>
            <button 
              className={`mode-button ${gameMode === 'complete' ? 'active' : ''}`}
              onClick={() => changeGameMode('complete')}
            >
              Wörter vervollständigen
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
            {gameMode === 'identify' ? (
              <>
                <h3 className="question">Welches Wort passt zu diesem Bild?</h3>
                <div className="word-image">{wordImage}</div>
                {timeLeft > 0 && (
                  <div className="timer">
                    <p>Zeit: {timeLeft} Sekunden</p>
                  </div>
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
              </>
            ) : (
              <>
                <h3 className="question">Vervollständige das Wort:</h3>
                <div className="incomplete-word">
                  {currentWord.split('').map((letter, index) => (
                    <span 
                      key={index} 
                      className={`word-letter ${hiddenWordParts[index] ? 'hidden' : ''}`}
                    >
                      {hiddenWordParts[index] ? '_' : letter}
                    </span>
                  ))}
                </div>
                
                <div className="word-image">{wordImage}</div>
                
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
              <p>Fantastisch! Du kennst viele Wörter auf einen Blick!</p>
            </div>
          )}
          
          {score >= 5 && score < 8 && (
            <div className="result-feedback good">
              <span className="result-emoji">👍</span>
              <p>Gut gemacht! Du lernst die Wörter sehr gut!</p>
            </div>
          )}
          
          {score < 5 && (
            <div className="result-feedback keep-trying">
              <span className="result-emoji">💪</span>
              <p>Übe weiter! Mit der Zeit wirst du immer mehr Wörter kennen!</p>
            </div>
          )}
          
          <button className="kids-button" onClick={resetGame}>
            Nochmal spielen
          </button>
        </div>
      )}
      
      <div className="game-instructions">
        <h4>Spielanleitung:</h4>
        {gameMode === 'identify' ? (
          <p>Schau dir das Bild an und wähle das passende Wort. Je mehr Wörter du sofort erkennst, desto besser kannst du lesen!</p>
        ) : (
          <p>Sieh dir das unvollständige Wort an und wähle den fehlenden Buchstaben. Das Bild hilft dir dabei.</p>
        )}
        <p>Tipp: Versuche, die Wörter zu merken und sie beim nächsten Mal schneller zu erkennen!</p>
      </div>
    </div>
  );
};

export default SightWordsGame;