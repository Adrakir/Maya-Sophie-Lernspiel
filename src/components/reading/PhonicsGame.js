import React, { useState, useEffect, useRef } from 'react';
import './ReadingGames.css';

const PhonicsGame = () => {
  const [level, setLevel] = useState(1);
  const [currentSound, setCurrentSound] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [disableOptions, setDisableOptions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const audioRef = useRef(null);

  // Lautdatenbank nach Schwierigkeitsgrad
  const phonicsData = {
    1: [
      { letter: 'A', sound: 'A wie Affe', examples: ['Apfel', 'Arm', 'Ameise'] },
      { letter: 'B', sound: 'B wie Ball', examples: ['Buch', 'Baum', 'Banane'] },
      { letter: 'C', sound: 'C wie Computer', examples: ['Clown', 'Cola', 'CD'] },
      { letter: 'D', sound: 'D wie Dino', examples: ['Dach', 'Dose', 'Daumen'] },
      { letter: 'E', sound: 'E wie Ente', examples: ['Eis', 'Elefant', 'Esel'] },
      { letter: 'F', sound: 'F wie Fisch', examples: ['Fenster', 'Feder', 'Frosch'] },
      { letter: 'M', sound: 'M wie Maus', examples: ['Mund', 'Mama', 'Milch'] },
      { letter: 'O', sound: 'O wie Oma', examples: ['Ohr', 'Obst', 'Ostern'] },
    ],
    2: [
      { letter: 'G', sound: 'G wie Giraffe', examples: ['Gabel', 'Garten', 'Gitarre'] },
      { letter: 'H', sound: 'H wie Hund', examples: ['Haus', 'Hand', 'Haare'] },
      { letter: 'I', sound: 'I wie Igel', examples: ['Insel', 'Iglu', 'Indianer'] },
      { letter: 'J', sound: 'J wie Junge', examples: ['Jacke', 'Joghurt', 'Jubel'] },
      { letter: 'K', sound: 'K wie Katze', examples: ['Kerze', 'Käse', 'Kuh'] },
      { letter: 'L', sound: 'L wie Löwe', examples: ['Lampe', 'Lippe', 'Luft'] },
      { letter: 'N', sound: 'N wie Nase', examples: ['Nuss', 'Nest', 'Nadel'] },
      { letter: 'P', sound: 'P wie Puppe', examples: ['Papa', 'Panda', 'Pinsel'] },
    ],
    3: [
      { letter: 'Q', sound: 'Qu wie Qualle', examples: ['Quark', 'Quelle', 'Quaste'] },
      { letter: 'R', sound: 'R wie Rose', examples: ['Rad', 'Regen', 'Rakete'] },
      { letter: 'S', sound: 'S wie Sonne', examples: ['Salz', 'Seife', 'Suppe'] },
      { letter: 'T', sound: 'T wie Tiger', examples: ['Tafel', 'Teller', 'Tulpe'] },
      { letter: 'U', sound: 'U wie Uhr', examples: ['Ufo', 'Ulme', 'Unterhose'] },
      { letter: 'V', sound: 'V wie Vogel', examples: ['Vase', 'Vater', 'Vulkan'] },
      { letter: 'W', sound: 'W wie Wolke', examples: ['Wal', 'Wasser', 'Wurm'] },
      { letter: 'X', sound: 'X wie Xylophon', examples: ['X-Ray', 'Xylophon', 'Xaver'] },
      { letter: 'Y', sound: 'Y wie Yak', examples: ['Yacht', 'Yoga', 'Yen'] },
      { letter: 'Z', sound: 'Z wie Zebra', examples: ['Zahn', 'Zoo', 'Zitrone'] },
      { letter: 'Ä', sound: 'Ä wie Äpfel', examples: ['Ärger', 'Ärmel', 'Ähre'] },
      { letter: 'Ö', sound: 'Ö wie Öl', examples: ['Öffnung', 'Ökosystem', 'Östlich'] },
      { letter: 'Ü', sound: 'Ü wie Überraschung', examples: ['Übung', 'Übelkeit', 'Über'] },
    ]
  };

  // Feedback für richtige und falsche Antworten
  const showCorrectFeedback = () => {
    const correctMessages = [
      "Super gemacht! 🎉",
      "Richtig! Der Buchstabe klingt genau so! ⭐",
      "Toll! Du kennst den Laut! 🧠",
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
      "Hmm, das klingt anders. Probier's noch einmal! 🌟",
      "Hör dir den Laut nochmal an und versuche es erneut! 🌱",
      "Nicht ganz! Achte auf den Klang des Buchstabens! 🧩",
      "Dieser Laut ist schwierig! Versuch es noch einmal! 🌈"
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
    let availableData = [];
    for (let i = 1; i <= level; i++) {
      availableData = [...availableData, ...phonicsData[i]];
    }
    
    // Zufälligen Laut auswählen
    const randomIndex = Math.floor(Math.random() * availableData.length);
    const selectedPhonic = availableData[randomIndex];
    
    // Zufällige Beispielwörter als Optionen (eines ist richtig)
    const correctExample = selectedPhonic.examples[Math.floor(Math.random() * selectedPhonic.examples.length)];
    let allExamples = [correctExample];
    
    // Weitere falsche Optionen hinzufügen
    while (allExamples.length < 4) {
      // Zufälliges anderes Phonic-Element auswählen
      const randomPhonicIndex = Math.floor(Math.random() * availableData.length);
      
      // Sicherstellen, dass es ein anderer Buchstabe ist
      if (randomPhonicIndex !== randomIndex) {
        const randomExample = availableData[randomPhonicIndex].examples[
          Math.floor(Math.random() * availableData[randomPhonicIndex].examples.length)
        ];
        
        if (!allExamples.includes(randomExample)) {
          allExamples.push(randomExample);
        }
      }
    }
    
    // Optionen mischen
    allExamples = allExamples.sort(() => Math.random() - 0.5);
    
    setCurrentSound(selectedPhonic.sound);
    setOptions(allExamples);
    setCorrectAnswer(correctExample);
  };

  // Beim ersten Laden und bei Änderung des Levels Frage generieren
  useEffect(() => {
    generateQuestion();
  }, [level]);

  // Audio-Feedback (simuliert - in einer echten App würden hier echte Audiodateien abgespielt)
  const playSound = () => {
    // Hier würde in einer echten Implementierung eine Audio-Datei abgespielt werden
    // In dieser Version simulieren wir es durch einen Texthinweis
    alert(`Hier würde der Laut "${currentSound}" abgespielt werden.`);
    
    // In einer vollständigen Version:
    // if (audioRef.current) {
    //   audioRef.current.play();
    // }
  };

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

  return (
    <div className="reading-game phonics-game">
      <h2>Laute & Buchstaben</h2>
      
      {showFeedback && (
        <div className={`feedback-message ${feedbackType}`}>
          <div className="feedback-content">
            {feedbackType === 'correct' && <span className="feedback-icon">✨</span>}
            {feedbackType === 'incorrect' && <span className="feedback-icon">💪</span>}
            <p>{feedbackMessage}</p>
          </div>
        </div>
      )}
      
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
            <h3 className="question">Welches Wort beginnt mit dem Laut:</h3>
            
            <div className="sound-card">
              <p className="current-sound">{currentSound}</p>
              <button className="sound-button" onClick={playSound}>
                <span role="img" aria-label="Anhören">🔊</span> Anhören
              </button>
              {/* Audio-Element (in einer vollständigen Version würde hier eine richtige Audiodatei verknüpft) */}
              <audio ref={audioRef} src="" />
            </div>
            
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
              <p>Fantastisch! Du kennst die Laute der Buchstaben super gut!</p>
            </div>
          )}
          
          {score >= 5 && score < 8 && (
            <div className="result-feedback good">
              <span className="result-emoji">👍</span>
              <p>Gut gemacht! Du lernst die Laute sehr gut!</p>
            </div>
          )}
          
          {score < 5 && (
            <div className="result-feedback keep-trying">
              <span className="result-emoji">💪</span>
              <p>Übe weiter! Die Laute zu lernen braucht etwas Zeit!</p>
            </div>
          )}
          
          <button className="kids-button" onClick={resetGame}>
            Nochmal spielen
          </button>
        </div>
      )}
      
      <div className="game-instructions">
        <h4>Spielanleitung:</h4>
        <p>Höre dir den Laut an und wähle das Wort, das mit diesem Laut beginnt.</p>
        <p>Jeder Buchstabe hat seinen eigenen Klang. Lerne die Laute kennen, um besser lesen zu können!</p>
      </div>
    </div>
  );
};

export default PhonicsGame;