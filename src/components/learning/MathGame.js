import React, { useState, useEffect } from 'react';
import './LearningGames.css';

const MathGame = ({ onCorrectAnswer, onIncorrectAnswer }) => {
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [disableOptions, setDisableOptions] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Neue Frage generieren
  const generateQuestion = () => {
    setDisableOptions(false);
    let num1, num2, answer, operation, questionText;
    
    // Basierend auf Level unterschiedliche Schwierigkeiten
    switch(level) {
      case 1: // Einfache Addition bis 10
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        answer = num1 + num2;
        questionText = `${num1} + ${num2} = ?`;
        operation = 'addition';
        break;
      case 2: // Addition und Subtraktion bis 20
        operation = Math.random() > 0.5 ? 'addition' : 'subtraction';
        if (operation === 'addition') {
          num1 = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
          answer = num1 + num2;
          questionText = `${num1} + ${num2} = ?`;
        } else {
          num1 = Math.floor(Math.random() * 10) + 10; // 10-19
          num2 = Math.floor(Math.random() * 9) + 1;   // 1-9
          answer = num1 - num2;
          questionText = `${num1} - ${num2} = ?`;
        }
        break;
      case 3: // Addition, Subtraktion und einfache Multiplikation
        operation = Math.random() < 0.33 ? 'addition' : (Math.random() < 0.66 ? 'subtraction' : 'multiplication');
        if (operation === 'addition') {
          num1 = Math.floor(Math.random() * 15) + 5;
          num2 = Math.floor(Math.random() * 15) + 5;
          answer = num1 + num2;
          questionText = `${num1} + ${num2} = ?`;
        } else if (operation === 'subtraction') {
          num1 = Math.floor(Math.random() * 20) + 10;
          num2 = Math.floor(Math.random() * 9) + 1;
          answer = num1 - num2;
          questionText = `${num1} - ${num2} = ?`;
        } else {
          num1 = Math.floor(Math.random() * 5) + 1;
          num2 = Math.floor(Math.random() * 5) + 1;
          answer = num1 * num2;
          questionText = `${num1} × ${num2} = ?`;
        }
        break;
      default:
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        answer = num1 + num2;
        questionText = `${num1} + ${num2} = ?`;
    }
    
    // Antwortoptionen generieren
    let answerOptions = [answer];
    
    // 3 falsche Antworten generieren
    while (answerOptions.length < 4) {
      // Falsche Antwort in der Nähe der richtigen
      let wrongAnswer;
      if (operation === 'multiplication') {
        wrongAnswer = answer + Math.floor(Math.random() * 7) - 3;
      } else {
        wrongAnswer = answer + Math.floor(Math.random() * 5) - 2;
      }
      
      // Keine negativen Zahlen oder Duplikate
      if (wrongAnswer >= 0 && !answerOptions.includes(wrongAnswer)) {
        answerOptions.push(wrongAnswer);
      }
    }
    
    // Antworten mischen
    answerOptions = answerOptions.sort(() => Math.random() - 0.5);
    
    setQuestion(questionText);
    setOptions(answerOptions);
    setCorrectAnswer(answer);
  };

  // Beim ersten Laden Frage generieren
  useEffect(() => {
    generateQuestion();
  }, [level]);

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

  // Level ändern
  const changeLevel = (newLevel) => {
    setLevel(newLevel);
    resetGame();
  };

  return (
    <div className="learning-game math-game">
      <h2>Mathe-Spaß</h2>
      
      <div className="level-selector">
        <p>Schwierigkeitsgrad:</p>
        <div className="level-buttons">
          <button 
            className={`level-button ${level === 1 ? 'active' : ''}`}
            onClick={() => changeLevel(1)}
          >
            Leicht
          </button>
          <button 
            className={`level-button ${level === 2 ? 'active' : ''}`}
            onClick={() => changeLevel(2)}
          >
            Mittel
          </button>
          <button 
            className={`level-button ${level === 3 ? 'active' : ''}`}
            onClick={() => changeLevel(3)}
          >
            Schwer
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
              <p>Fantastisch! Du bist ein Mathe-Genie!</p>
            </div>
          )}
          
          {score >= 5 && score < 8 && (
            <div className="result-feedback good">
              <span className="result-emoji">👍</span>
              <p>Gut gemacht! Du wirst immer besser!</p>
            </div>
          )}
          
          {score < 5 && (
            <div className="result-feedback keep-trying">
              <span className="result-emoji">💪</span>
              <p>Übe weiter! Mit jedem Versuch lernst du mehr!</p>
            </div>
          )}
          
          <button className="kids-button" onClick={resetGame}>
            Nochmal spielen
          </button>
        </div>
      )}
      
      <div className="game-instructions">
        <h4>Spielanleitung:</h4>
        <p>Wähle die richtige Antwort für die Matheaufgabe aus.</p>
        <p>Versuche, so viele Fragen wie möglich richtig zu beantworten!</p>
      </div>
    </div>
  );
};

export default MathGame;