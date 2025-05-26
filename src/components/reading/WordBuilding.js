import React, { useState, useEffect } from 'react';
import './ReadingGames.css';

/**
 * Spiel zum Wörter bauen aus Buchstaben
 * Zielgruppe: Kinder, die bereits Buchstaben kennen und einfache Wörter bilden lernen
 * 
 * @returns {JSX.Element} Rendered component
 */
const WordBuilding = () => {
  // Spielzustände
  const [level, setLevel] = useState(1);
  const [gameMode, setGameMode] = useState('build'); // 'build' oder 'complete'
  const [currentWord, setCurrentWord] = useState('');
  const [displayWord, setDisplayWord] = useState('');
  const [wordImage, setWordImage] = useState('');
  const [availableLetters, setAvailableLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [missingLetters, setMissingLetters] = useState([]);
  const [missingPositions, setMissingPositions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Wortdatenbank nach Schwierigkeitsgrad
  const wordData = {
    1: [
      { word: 'MAMA', image: '👩' },
      { word: 'PAPA', image: '👨' },
      { word: 'BALL', image: '⚽' },
      { word: 'AUTO', image: '🚗' },
      { word: 'HUND', image: '🐶' },
      { word: 'KATZE', image: '🐱' },
      { word: 'HAUS', image: '🏠' },
      { word: 'BUCH', image: '📕' },
    ],
    2: [
      { word: 'MAUS', image: '🐭' },
      { word: 'BAUM', image: '🌳' },
      { word: 'SCHULE', image: '🏫' },
      { word: 'FISCH', image: '🐠' },
      { word: 'VOGEL', image: '🐦' },
      { word: 'APFEL', image: '🍎' },
      { word: 'SONNE', image: '☀️' },
      { word: 'BLUME', image: '🌸' },
    ],
    3: [
      { word: 'ELEFANT', image: '🐘' },
      { word: 'BANANE', image: '🍌' },
      { word: 'GIRAFFE', image: '🦒' },
      { word: 'KUCHEN', image: '🍰' },
      { word: 'WASSER', image: '💧' },
      { word: 'RAKETE', image: '🚀' },
      { word: 'SCHMETTERLING', image: '🦋' },
      { word: 'REGENBOGEN', image: '🌈' },
    ]
  };

  // Feedback für richtige und falsche Antworten
  const showCorrectFeedback = () => {
    const correctMessages = [
      "Super gemacht! 🎉",
      "Richtig! Du hast das Wort gebaut! ⭐",
      "Toll! Du bist ein Wort-Baumeister! 🧠",
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
      "Fast richtig! Probiere es noch einmal! 💪",
      "Hmm, das stimmt nicht ganz. Schau genau auf die Buchstaben! 🌟",
      "Dieses Wort ist knifflig! Versuch es noch einmal! 🌱",
      "Nicht ganz! Achte auf die richtige Reihenfolge! 🧩",
      "Fast! Du schaffst das! 🌈"
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
    // Zufälliges Wort für das aktuelle Level auswählen
    const wordsForLevel = wordData[level];
    const randomIndex = Math.floor(Math.random() * wordsForLevel.length);
    const selectedWordData = wordsForLevel[randomIndex];
    const wordToGuess = selectedWordData.word;
    
    setCurrentWord(wordToGuess);
    setWordImage(selectedWordData.image);
    
    if (gameMode === 'build') {
      // Modus: Komplettes Wort aus Buchstaben bauen
      setDisplayWord('');
      setSelectedLetters([]);
      
      // Buchstaben des Wortes plus ein paar zusätzliche zufällige Buchstaben
      let letters = wordToGuess.split('');
      
      // Zufällige zusätzliche Buchstaben hinzufügen
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const extraLettersCount = Math.min(5, Math.max(2, Math.floor(wordToGuess.length / 2)));
      
      for (let i = 0; i < extraLettersCount; i++) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        letters.push(randomLetter);
      }
      
      // Buchstaben mischen
      letters = letters.sort(() => Math.random() - 0.5);
      setAvailableLetters(letters);
      
    } else if (gameMode === 'complete') {
      // Modus: Wort mit fehlenden Buchstaben ergänzen
      setSelectedLetters([]);
      
      // Anzahl der fehlenden Buchstaben basierend auf Wortlänge und Level
      const missingCount = Math.min(
        Math.floor(wordToGuess.length * 0.4),
        level === 1 ? 1 : (level === 2 ? 2 : 3)
      );
      
      // Zufällige Positionen für fehlende Buchstaben
      let positions = [];
      while (positions.length < missingCount) {
        const pos = Math.floor(Math.random() * wordToGuess.length);
        if (!positions.includes(pos)) {
          positions.push(pos);
        }
      }
      
      // Fehlende Buchstaben und deren Positionen speichern
      setMissingPositions(positions);
      setMissingLetters(positions.map(pos => wordToGuess[pos]));
      
      // Anzeige-Wort mit Lücken erstellen
      let display = '';
      for (let i = 0; i < wordToGuess.length; i++) {
        if (positions.includes(i)) {
          display += '_';
        } else {
          display += wordToGuess[i];
        }
      }
      setDisplayWord(display);
      
      // Verfügbare Buchstaben: die fehlenden plus zufällige
      let letters = [...positions.map(pos => wordToGuess[pos])];
      
      // Zufällige zusätzliche Buchstaben hinzufügen
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const extraLettersCount = Math.min(5, Math.max(2, missingCount));
      
      for (let i = 0; i < extraLettersCount; i++) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        letters.push(randomLetter);
      }
      
      // Buchstaben mischen
      letters = letters.sort(() => Math.random() - 0.5);
      setAvailableLetters(letters);
    }
    
    setGameComplete(false);
  };

  // Beim ersten Laden und bei Änderung des Levels oder Modus Frage generieren
  useEffect(() => {
    generateQuestion();
  }, [level, gameMode]);

  // Buchstaben auswählen
  const selectLetter = (letter, index) => {
    if (gameComplete) return;
    
    // Buchstabe aus verfügbaren entfernen
    const newAvailable = [...availableLetters];
    newAvailable.splice(index, 1);
    setAvailableLetters(newAvailable);
    
    // Buchstabe zu ausgewählten hinzufügen
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);
    
    // Prüfen, ob Wort fertig ist
    checkWordCompletion(newSelected);
  };

  // Buchstaben zurücklegen
  const deselectLetter = (letter, index) => {
    if (gameComplete) return;
    
    // Buchstabe aus ausgewählten entfernen
    const newSelected = [...selectedLetters];
    newSelected.splice(index, 1);
    setSelectedLetters(newSelected);
    
    // Buchstabe zu verfügbaren hinzufügen
    setAvailableLetters([...availableLetters, letter]);
  };

  // Prüfen, ob das Wort fertig ist
  const checkWordCompletion = (selected) => {
    if (gameMode === 'build') {
      // Im Bau-Modus: Prüfen, ob das gebaute Wort korrekt ist
      const builtWord = selected.join('');
      
      if (builtWord === currentWord) {
        handleCorrectAnswer();
      }
      
    } else if (gameMode === 'complete') {
      // Im Ergänzungs-Modus: Prüfen, ob alle Lücken korrekt gefüllt sind
      if (selected.length === missingLetters.length) {
        // Prüfen, ob die ausgewählten Buchstaben den fehlenden entsprechen
        let correct = true;
        for (let i = 0; i < missingPositions.length; i++) {
          const pos = missingPositions[i];
          const correctLetter = currentWord[pos];
          
          if (!selected.includes(correctLetter)) {
            correct = false;
            break;
          }
        }
        
        if (correct) {
          handleCorrectAnswer();
        } else {
          showIncorrectFeedback();
          // Zurücksetzen für einen neuen Versuch
          resetCurrentQuestion();
        }
      }
    }
  };

  // Richtige Antwort behandeln
  const handleCorrectAnswer = () => {
    setGameComplete(true);
    showCorrectFeedback();
    setScore(score + 1);
    setQuestionsAsked(questionsAsked + 1);
    
    // Nach Verzögerung nächste Frage oder Ergebnis zeigen
    setTimeout(() => {
      if (questionsAsked + 1 >= 5) { // Weniger Fragen wegen Komplexität
        setShowResults(true);
      } else {
        generateQuestion();
      }
    }, 2000);
  };

  // Aktuelle Frage zurücksetzen (für Fehlversuche)
  const resetCurrentQuestion =