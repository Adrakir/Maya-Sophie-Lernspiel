import React, { useState, useEffect } from 'react';
import './ReadingGames.css';

const SyllableGame = () => {
  const [level, setLevel] = useState(1);
  const [gameMode, setGameMode] = useState('combine'); // 'combine' oder 'separate'
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [disableOptions, setDisableOptions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Silbendatenbank nach Schwierigkeitsgrad
  const syllablesData = {
    1: [
      { word: 'Mama', syllables: ['Ma', 'ma'] },
      { word: 'Papa', syllables: ['Pa', 'pa'] },
      { word: 'Auto', syllables: ['Au', 'to'] },
      { word: 'Hose', syllables: ['Ho', 'se'] },
      { word: 'Tasse', syllables: ['Tas', 'se'] },
      { word: 'Katze', syllables: ['Kat', 'ze'] },
      { word: 'Sonne', syllables: ['Son', 'ne'] },
      { word: 'Haus', syllables: ['Haus'] },
      { word: 'Ball', syllables: ['Ball'] },
      { word: 'Buch', syllables: ['Buch'] },
    ],
    2: [
      { word: 'Apfel', syllables: ['Ap', 'fel'] },
      { word: 'Banane', syllables: ['Ba', 'na', 'ne'] },
      { word: 'Schule', syllables: ['Schu', 'le'] },
      { word: 'Garten', syllables: ['Gar', 'ten'] },
      { word: 'Fenster', syllables: ['Fens', 'ter'] },
      { word: 'Teller', syllables: ['Tel', 'ler'] },
      { word: 'Puppe', syllables: ['Pup', 'pe'] },
      { word: 'Lampe', syllables: ['Lam', 'pe'] },
      { word: 'Brille', syllables: ['Bril', 'le'] },
      { word: 'Tafel', syllables: ['Ta', 'fel'] },
    ],
    3: [
      { word: 'Ananas', syllables: ['A', 'na', 'nas'] },
      { word: 'Elefant', syllables: ['E', 'le', 'fant'] },
      { word: 'Krokodil', syllables: ['Kro', 'ko', 'dil'] },
      { word: 'Helikopter', syllables: ['He', 'li', 'kop', 'ter'] },
      { word: 'Schokolade', syllables: ['Scho', 'ko', 'la', 'de'] },
      { word: 'Kindergarten', syllables: ['Kin', 'der', 'gar', 'ten'] },
      { word: 'Spielplatz', syllables: ['Spiel', 'platz'] },
      { word: 'Dinosaurier', syllables: ['Di', 'no', 'sau', 'ri', 'er'] },
      { word: 'Geburtstag', syllables: ['Ge', 'burts', 'tag'] },
      { word: 'Schmetterling', syllables: ['Schmet', 'ter', 'ling'] },
    ]
  };

  // Feedback für richtige und falsche Antworten
  const showCorrectFeedback = () => {
    const correctMessages = [
      "Super gemacht! 🎉",
      "Richtig! Du kannst gut Silben erkennen! ⭐",
      "Toll! Du wirst ein Silben-Meister! 🧠",
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
      "Fast richtig! Hör genau hin und versuch es noch einmal! 💪",
      "Hmm, das stimmt nicht ganz. Probier's noch einmal! 🌟",
      "Versuch die Silben noch einmal langsam zu sprechen! 🌱",
      "Nicht ganz! Achte auf die Silben-Trennung! 🧩",
      "Diese Silben sind schwierig! Versuch es noch einmal! 🌈"
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
    
    // Alle verfügbaren Daten für das aktuelle Level holen
    const availableData = syllablesData[level];
    
    // Zufälliges Wort auswählen
    const randomIndex = Math.floor(Math.random() * availableData.length);
    const selectedWord = availableData[randomIndex];
    
    if (gameMode === 'combine') {
      // Modus: Silben zu Wort zusammensetzen
      setQuestion(`Welches Wort ergibt sich aus diesen Silben: ${selectedWord.syllables.join(' - ')}?`);
      
      // Richtige Antwort ist das vollständige Wort
      setCorrectAnswer(selectedWord.word);
      
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
      
    } else if (gameMode === 'separate') {
      // Modus: Wort in Silben trennen
      setQuestion(`Wie trennt man "${selectedWord.word}" in Silben?`);
      
      // Richtige Antwort sind die getrennten Silben
      const correctSyllables = selectedWord.syllables.join(' - ');
      setCorrectAnswer(correctSyllables);
      
      // Optionen: die richtigen Silben und 3 falsche Trennungen
      let syllableOptions = [correctSyllables];
      
      // Falsche Silbenkombinationen erstellen
      while (syllableOptions.length < 4) {
        // Eine zufällige falsche Trennung erstellen
        if (selectedWord.syllables.length === 1) {
          // Für einsilbige Wörter
          const chars = selectedWord.word.split('');
          const midPoint = Math.floor(chars.length / 2);
          const fakeSyllables = [chars.slice(0, midPoint).join(''), chars.slice(midPoint).join('')].join(' - ');
          
          if (!syllableOptions.includes(fakeSyllables)) {
            syllableOptions.push(fakeSyllables);
          }
        } else {
          // Für mehrsilbige Wörter
          const randomWordIndex = Math.floor(Math.random() * availableData.length);
          if (randomWordIndex !== randomIndex) {
            const fakeSyllables = availableData[randomWordIndex].syllables.join(' - ');
            if (!syllableOptions.includes(fakeSyllables) && 
                availableData[randomWordIndex].syllables.length === selectedWord.syllables.length) {
              syllableOptions.push(fakeSyllables);
            }
          } else {
            // Wenn wir nicht genug passende Wörter finden, eine zufällige Trennung erstellen
            const chars = selectedWord.word.split('');
            let fakeSyllables = [];
            
            // Zufällige Trennpunkte setzen
            for (let i = 0; i < selectedWord.syllables.length - 1; i++) {
              const trennpunkt = Math.floor(Math.random() * (chars.length - 1)) + 1;
              fakeSyllables.push(chars.slice(0, trennpunkt).join(''));
              chars.splice(0, trennpunkt);
            }
            fakeSyllables.push(chars.join(''));
            
            const fakeString = fakeSyllables.join(' - ');
            if (!syllableOptions.includes(fakeString) && fakeString !== correctSyllables) {
              syllableOptions.push(fakeString);
            }
          }
        }
      }
      
      // Optionen mischen
      syllableOptions = syllableOptions.sort(() => Math.random() - 0.5);
      setOptions(syllableOptions);
    }
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
    <div className="reading-game syllable-game">
      <h2>Silben-Spaß</h2>
      
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
              className={`mode-button ${gameMode === 'combine' ? 'active' : ''}`}
              onClick={() => changeGameMode('combine')}
            >
              Silben verbinden
            </button>
            <button 
              className={`mode-button ${gameMode === 'separate' ? 'active' : ''}`}
              onClick={() => changeGameMode('separate')}
            >
              Silben trennen
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
            <h3 className="question">{question}</h3>
            
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
              <p>Fantastisch! Du bist ein Silben-Meister!</p>
            </div>
          )}
          
          {score >= 5 && score < 8 && (
            <div className="result-feedback good">
              <span className="result-emoji">👍</span>
              <p>Gut gemacht! Du lernst die Silben sehr gut!</p>
            </div>
          )}
          
          {score < 5 && (
            <div className="result-feedback keep-trying">
              <span className="result-emoji">💪</span>
              <p>Übe weiter! Silben zu erkennen braucht etwas Zeit!</p>
            </div>
          )}
          
          <button className="kids-button" onClick={resetGame}>
            Nochmal spielen
          </button>
        </div>
      )}
      
      <div className="game-instructions">
        <h4>Spielanleitung:</h4>
        {gameMode === 'combine' ? (
          <p>Verbinde die Silben zum richtigen Wort. Wähle das Wort aus, das aus den angezeigten Silben entsteht.</p>
        ) : (
          <p>Trenne das Wort in Silben. Wähle die richtige Silbentrennung für das angezeigte Wort.</p>
        )}
        <p>Tipp: Sprich die Wörter laut aus und klatsche für jede Silbe einmal in die Hände!</p>
      </div>
    </div>
  );
};

export default SyllableGame;