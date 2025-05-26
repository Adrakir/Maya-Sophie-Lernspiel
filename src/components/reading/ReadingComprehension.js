import React, { useState, useEffect } from 'react';
import './ReadingGames.css';

const ReadingComprehension = () => {
  const [level, setLevel] = useState(1);
  const [currentStory, setCurrentStory] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showStory, setShowStory] = useState(true);
  const [storyReadTime, setStoryReadTime] = useState(0);
  const [disableOptions, setDisableOptions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [readingTimer, setReadingTimer] = useState(null);

  // Datenbank der Geschichten und Fragen nach Schwierigkeitsgrad
  const storiesData = {
    1: [
      {
        title: "Mia und der Ball",
        text: "Mia hat einen roten Ball. Sie spielt im Garten. Der Ball rollt weg. Mia sucht den Ball. Sie findet ihn unter einem Busch. Mia ist froh.",
        questions: [
          {
            question: "Welche Farbe hat Mias Ball?",
            options: ["Rot", "Blau", "Grün", "Gelb"],
            answer: "Rot"
          },
          {
            question: "Wo spielt Mia?",
            options: ["Im Zimmer", "Im Garten", "Im Park", "Am Strand"],
            answer: "Im Garten"
          },
          {
            question: "Wo findet Mia ihren Ball?",
            options: ["Auf dem Dach", "Im Teich", "Unter einem Busch", "Hinter dem Haus"],
            answer: "Unter einem Busch"
          }
        ],
        readingTime: 30 // Sekunden zum Lesen
      },
      {
        title: "Tim und sein Hund",
        text: "Tim hat einen Hund. Der Hund heißt Rex. Rex ist braun und groß. Tim geht mit Rex spazieren. Sie laufen im Park. Rex jagt einen Stock. Tim lacht.",
        questions: [
          {
            question: "Wie heißt Tims Hund?",
            options: ["Max", "Bello", "Rex", "Fido"],
            answer: "Rex"
          },
          {
            question: "Welche Farbe hat Rex?",
            options: ["Schwarz", "Weiß", "Braun", "Grau"],
            answer: "Braun"
          },
          {
            question: "Was jagt Rex im Park?",
            options: ["Einen Ball", "Eine Katze", "Einen Stock", "Ein Kaninchen"],
            answer: "Einen Stock"
          }
        ],
        readingTime: 35 // Sekunden zum Lesen
      }
    ],
    2: [
      {
        title: "Das verlorene Fahrrad",
        text: "Lisa hat ein neues Fahrrad. Es ist blau mit weißen Streifen. Eines Tages fährt Lisa zur Schule. Nach der Schule ist ihr Fahrrad weg! Lisa ist traurig. Sie sucht überall. Dann sieht sie ihren Freund Tom. Er hat das Fahrrad gefunden. Es stand hinter der Turnhalle. Lisa ist sehr glücklich und bedankt sich bei Tom.",
        questions: [
          {
            question: "Welche Farbe hat Lisas Fahrrad?",
            options: ["Rot mit schwarzen Streifen", "Grün mit gelben Punkten", "Blau mit weißen Streifen", "Pink mit lila Sternen"],
            answer: "Blau mit weißen Streifen"
          },
          {
            question: "Wohin fährt Lisa mit ihrem Fahrrad?",
            options: ["Zum Supermarkt", "Zur Schule", "Zum Spielplatz", "Zu ihrer Oma"],
            answer: "Zur Schule"
          },
          {
            question: "Wer hat Lisas Fahrrad gefunden?",
            options: ["Ihr Vater", "Die Lehrerin", "Tom", "Lisa selbst"],
            answer: "Tom"
          },
          {
            question: "Wo stand das Fahrrad?",
            options: ["Vor der Schule", "Im Fahrradständer", "Hinter der Turnhalle", "Auf dem Schulhof"],
            answer: "Hinter der Turnhalle"
          }
        ],
        readingTime: 45 // Sekunden zum Lesen
      },
      {
        title: "Der kleine Drache",
        text: "In einer Höhle lebt ein kleiner Drache. Er heißt Funki. Funki kann noch kein Feuer spucken. Das macht ihn traurig. Alle anderen Drachen können es schon. Eines Tages trifft Funki einen alten, weisen Drachen. Der alte Drache zeigt Funki einen Trick. Funki übt jeden Tag. Nach einer Woche kann er endlich Feuer spucken! Es ist nur ein kleines Feuer, aber Funki ist sehr stolz.",
        questions: [
          {
            question: "Wie heißt der kleine Drache?",
            options: ["Flammi", "Funki", "Feuri", "Flitzi"],
            answer: "Funki"
          },
          {
            question: "Was kann Funki noch nicht?",
            options: ["Fliegen", "Feuer spucken", "Schwimmen", "Singen"],
            answer: "Feuer spucken"
          },
          {
            question: "Wer hilft Funki?",
            options: ["Seine Mutter", "Ein Zauberer", "Ein alter, weiser Drache", "Ein Ritter"],
            answer: "Ein alter, weiser Drache"
          },
          {
            question: "Wie lange übt Funki, bis er Feuer spucken kann?",
            options: ["Einen Tag", "Eine Woche", "Einen Monat", "Ein Jahr"],
            answer: "Eine Woche"
          }
        ],
        readingTime: 50 // Sekunden zum Lesen
      }
    ],
    3: [
      {
        title: "Das geheimnisvolle Paket",
        text: "Es war ein regnerischer Samstag, als bei Emma ein Paket ankam. Es war in braunes Papier eingewickelt und mit einer goldenen Schnur gebunden. Auf dem Paket stand kein Absender. Nur Emmas Name und Adresse. Emma war sehr neugierig. Vorsichtig öffnete sie das Paket. Darin lag ein altes Buch mit einem ledernen Einband. Als Emma das Buch aufschlug, fand sie eine Karte. Auf der Karte stand: 'Folge den Hinweisen und finde den Schatz.' Emma war aufgeregt. Das war der Beginn eines großen Abenteuers. Sie las das Buch die ganze Nacht. Am nächsten Morgen machte sie sich auf die Suche nach dem ersten Hinweis.",
        questions: [
          {
            question: "An welchem Wochentag kam das Paket an?",
            options: ["Montag", "Mittwoch", "Freitag", "Samstag"],
            answer: "Samstag"
          },
          {
            question: "Wie war das Wetter, als das Paket ankam?",
            options: ["Sonnig", "Regnerisch", "Neblig", "Stürmisch"],
            answer: "Regnerisch"
          },
          {
            question: "Was war in dem Paket?",
            options: ["Ein Spielzeug", "Ein Brief", "Ein altes Buch", "Eine Schatzkarte"],
            answer: "Ein altes Buch"
          },
          {
            question: "Was stand auf der Karte im Buch?",
            options: ["Alles Gute zum Geburtstag", "Folge den Hinweisen und finde den Schatz", "Lies dieses Buch bis zum Ende", "Pass gut auf dieses Buch auf"],
            answer: "Folge den Hinweisen und finde den Schatz"
          },
          {
            question: "Was machte Emma in der Nacht?",
            options: ["Sie schlief", "Sie las das Buch", "Sie telefonierte mit Freunden", "Sie suchte nach dem Schatz"],
            answer: "Sie las das Buch"
          }
        ],
        readingTime: 60 // Sekunden zum Lesen
      },
      {
        title: "Die Klassenfahrt",
        text: "Die Klasse 3b fuhr für drei Tage auf einen Bauernhof. Alle Kinder waren sehr aufgeregt. Sie fuhren mit einem großen Bus. Auf dem Bauernhof gab es viele Tiere: Kühe, Schweine, Hühner und sogar zwei Pferde. Am ersten Tag durften die Kinder die Tiere füttern. Jonas hatte etwas Angst vor den großen Kühen, aber Frau Müller, die Lehrerin, half ihm. Am zweiten Tag backten alle zusammen Brot. Sie mahlten das Korn selbst zu Mehl. Das war anstrengend, aber das Brot schmeckte später sehr lecker. Am letzten Tag machten sie eine Schatzsuche. Die Klasse wurde in vier Gruppen eingeteilt. Jede Gruppe bekam einen Plan vom Bauernhof mit Hinweisen. Die Gruppe von Lea, Tim und Sophie fand den Schatz zuerst: Es war eine Kiste mit Süßigkeiten für alle Kinder. Am Abend gab es ein Lagerfeuer mit Stockbrot. Alle sangen Lieder und erzählten Geschichten. Als die Klasse wieder nach Hause fuhr, waren alle müde, aber glücklich.",
        questions: [
          {
            question: "Wie lange dauerte die Klassenfahrt?",
            options: ["Zwei Tage", "Drei Tage", "Eine Woche", "Zehn Tage"],
            answer: "Drei Tage"
          },
          {
            question: "Wovor hatte Jonas Angst?",
            options: ["Vor den Pferden", "Vor den Schweinen", "Vor den großen Kühen", "Vor den Hühnern"],
            answer: "Vor den großen Kühen"
          },
          {
            question: "Was backten die Kinder am zweiten Tag?",
            options: ["Kuchen", "Brot", "Kekse", "Pizza"],
            answer: "Brot"
          },
          {
            question: "Was war der Schatz bei der Schatzsuche?",
            options: ["Spielzeug", "Eine Kiste mit Süßigkeiten", "Ein Buch", "Geld"],
            answer: "Eine Kiste mit Süßigkeiten"
          },
          {
            question: "Was gab es am letzten Abend?",
            options: ["Eine Disco", "Ein Lagerfeuer mit Stockbrot", "Ein Filmabend", "Eine Nachtwanderung"],
            answer: "Ein Lagerfeuer mit Stockbrot"
          }
        ],
        readingTime: 75 // Sekunden zum Lesen
      }
    ]
  };

  // Feedback für richtige und falsche Antworten
  const showCorrectFeedback = () => {
    const correctMessages = [
      "Super gemacht! 🎉",
      "Richtig! Du hast die Geschichte gut verstanden! ⭐",
      "Toll! Du bist ein aufmerksamer Leser! 🧠",
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
      "Fast richtig! Lies die Geschichte noch einmal genau! 💪",
      "Hmm, das stimmt nicht ganz. Schau nochmal in der Geschichte nach! 🌟",
      "Diese Frage ist schwierig! Versuch es noch einmal! 🌱",
      "Nicht ganz! Achte auf die Details in der Geschichte! 🧩",
      "Fast! Lies genau, was in der Geschichte passiert! 🌈"
    ];
    
    setFeedbackMessage(incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)]);
    setFeedbackType('incorrect');
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };

  // Neue Geschichte und Fragen laden
  const loadStory = () => {
    // Zufällige Geschichte für das aktuelle Level auswählen
    const storiesForLevel = storiesData[level];
    const randomIndex = Math.floor(Math.random() * storiesForLevel.length);
    const selectedStory = storiesForLevel[randomIndex];
    
    setCurrentStory(selectedStory);
    setCurrentQuestion(0);
    setScore(0);
    setShowStory(true);
    setShowResults(false);
    
    // Timer für die Lesezeit starten
    setStoryReadTime(selectedStory.readingTime);
    
    const timer = setInterval(() => {
      setStoryReadTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setShowStory(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setReadingTimer(timer);
  };

  // Frage laden
  const loadQuestion = (questionIndex) => {
    if (questionIndex >= currentStory.questions.length) {
      // Alle Fragen beantwortet, Ergebnis anzeigen
      setShowResults(true);
      return;
    }
    
    const question = currentStory.questions[questionIndex];
    setOptions(question.options);
    setCorrectAnswer(question.answer);
    setDisableOptions(false);
  };

  // Beim ersten Laden und bei Änderung des Levels neue Geschichte laden
  useEffect(() => {
    loadStory();
    
    // Cleanup beim Unmount
    return () => {
      clearInterval(readingTimer);
    };
  }, [level]);

  // Beim Wechsel der Frage neue Frage laden
  useEffect(() => {
    if (!showStory) {
      loadQuestion(currentQuestion);
    }
  }, [currentQuestion, showStory]);

  // Geschichte erneut anzeigen
  const showStoryAgain = () => {
    clearInterval(readingTimer);
    setShowStory(true);
    setStoryReadTime(currentStory.readingTime);
    
    const timer = setInterval(() => {
      setStoryReadTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setShowStory(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setReadingTimer(timer);
  };

  // Antwort überprüfen
  const checkAnswer = (selectedAnswer) => {
    setDisableOptions(true);
    
    if (selectedAnswer === correctAnswer) {
      showCorrectFeedback();
      setScore(score + 1);
    } else {
      showIncorrectFeedback();
    }
    
    // Nach kurzer Verzögerung nächste Frage
    setTimeout(() => {
      setCurrentQuestion(currentQuestion + 1);
    }, 2000);
  };

  // Spiel zurücksetzen
  const resetGame = () => {
    clearInterval(readingTimer);
    loadStory();
  };

  // Level ändern
  const changeLevel = (newLevel) => {
    setLevel(newLevel);
    clearInterval(readingTimer);
    loadStory();
  };

  return (
    <div className="reading-game comprehension-game">
      <h2>Lese-Verständnis</h2>
      
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
      
      {showStory ? (
        <div className="story-container">
          <h3 className="story-title">{currentStory.title}</h3>
          
          <div className="timer">
            <p>Zeit zum Lesen: {storyReadTime} Sekunden</p>
            <div className="timer-bar">
              <div 
                className="timer-fill" 
                style={{ width: `${(storyReadTime / currentStory.readingTime) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="story-text">
            <p>{currentStory.text}</p>
          </div>
          
          <button 
            className="kids-button"
            onClick={() => {
              clearInterval(readingTimer);
              setShowStory(false);
            }}
          >
            Ich bin fertig mit Lesen
          </button>
        </div>
      ) : !showResults ? (
        <div className="question-container">
          <div className="question-progress">
            <p>Frage {currentQuestion + 1} von {currentStory.questions.length}</p>
          </div>
          
          <h3 className="question">{currentStory.questions[currentQuestion]?.question}</h3>
          
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
          
          <button 
            className="show-story-button"
            onClick={showStoryAgain}
          >
            Geschichte noch einmal lesen
          </button>
        </div>
      ) : (
        <div className="game-results">
          <h3>Spielergebnis</h3>
          <div className="result-score">
            <span className="score-number">{score}</span>
            <span className="score-text">von {currentStory.questions.length} Punkten</span>
          </div>
          
          {score === currentStory.questions.length && (
            <div className="result-feedback great">
              <span className="result-emoji">🌟</span>
              <p>Fantastisch! Du hast alle Fragen richtig beantwortet!</p>
            </div>
          )}
          
          {score >= Math.floor(currentStory.questions.length / 2) && score < currentStory.questions.length && (
            <div className="result-feedback good">
              <span className="result-emoji">👍</span>
              <p>Gut gemacht! Du hast die Geschichte gut verstanden!</p>
            </div>
          )}
          
          {score < Math.floor(currentStory.questions.length / 2) && (
            <div className="result-feedback keep-trying">
              <span className="result-emoji">💪</span>
              <p>Übe weiter! Mit der Zeit wirst du immer besser im Verstehen von Geschichten!</p>
            </div>
          )}
          
          <button className="kids-button" onClick={resetGame}>
            Neue Geschichte lesen
          </button>
        </div>
      )}
      
      <div className="game-instructions">
        <h4>Spielanleitung:</h4>
        <p>1. Lies die Geschichte sorgfältig durch.</p>
        <p>2. Beantworte danach die Fragen zur Geschichte.</p>
        <p>3. Du kannst die Geschichte jederzeit noch einmal lesen, wenn du unsicher bist.</p>
        <p>Tipp: Achte besonders auf die Details in der Geschichte!</p>
      </div>
    </div>
  );
};

export default ReadingComprehension;