/**
 * Game_BallonSchiessen.js
 * 
 * Spielmodul: Ballon-Schießen mit Wörtern
 * Kinder schießen auf Ballons mit bestimmten Wortarten oder Buchstabenkombinationen
 */
const Game_BallonSchiessen = {
    /**
     * Spielkonfiguration
     */
    config: {
        gameName: "Ballon-Schießen",
        gameIcon: "🎈",
        maxTime: 60, // Sekunden
        targetCount: 15, // Anzahl zu treffender Ballons
    },
    
    /**
     * Spielvariablen
     */
    gameVars: {
        activeGameData: null,
        gameContainer: null,
        scoreCounter: 0,
        timeRemaining: 0,
        timer: null,
        balloons: [],
        targetType: "",
        difficultyLevel: 1,
        onGameEndCallback: null,
        soundEffects: {
            pop: new Audio('assets/sounds/balloon-pop.mp3'),
            miss: new Audio('assets/sounds/miss.mp3'),
            success: new Audio('assets/sounds/success.mp3')
        }
    },
    
    /**
     * Initialisiert das Spiel
     * @param {Object} gameData - Spieldaten mit Wörtern und Schwierigkeitsgrad
     * @param {Function} onGameEnd - Callback bei Spielende
     */
    init: function(gameData, onGameEnd) {
        console.log("Initialisiere Ballon-Schießen Spiel...");
        
        // Spielvariablen zurücksetzen
        this.gameVars.activeGameData = gameData;
        this.gameVars.scoreCounter = 0;
        this.gameVars.timeRemaining = this.config.maxTime;
        this.gameVars.onGameEndCallback = onGameEnd;
        this.gameVars.difficultyLevel = gameData.difficulty || 1;
        
        // Zieltyp basierend auf Schwierigkeit festlegen
        if (this.gameVars.difficultyLevel === 1) {
            this.gameVars.targetType = "anfangsbuchstabe"; // z.B. "Wörter mit A"
        } else if (this.gameVars.difficultyLevel === 2) {
            this.gameVars.targetType = "wortart"; // z.B. "Tiere"
        } else {
            this.gameVars.targetType = "silbenanzahl"; // z.B. "Wörter mit 2 Silben"
        }
        
        // Spielcontainer erstellen
        this.render();
        
        // Anleitung vorlesen
        let instructionText = `Schieße auf die richtigen Ballons! `;
        
        if (this.gameVars.targetType === "anfangsbuchstabe") {
            instructionText += `Treffe alle Ballons mit Wörtern, die mit ${gameData.targetLetter} beginnen.`;
        } else if (this.gameVars.targetType === "wortart") {
            instructionText += `Treffe alle Ballons mit ${gameData.targetCategory}.`;
        } else {
            instructionText += `Treffe alle Ballons mit Wörtern, die ${gameData.targetSyllables} Silben haben.`;
        }
        
        AudioManager.speak(instructionText);
    },
    
    /**
     * Rendert die Spieloberfläche
     */
    render: function() {
        // Spielcontainer erstellen
        const gameElement = document.createElement('div');
        gameElement.id = 'balloon-shooting-game';
        gameElement.className = 'game-container balloon-game';
        
        // Header mit Spielinfo
        const headerHTML = `
            <div class="game-header">
                <div class="game-score">Punkte: <span id="balloon-score">0</span> / ${this.config.targetCount}</div>
                <div class="game-timer">Zeit: <span id="balloon-timer">${this.config.maxTime}</span>s</div>
            </div>
        `;
        
        // Anleitung basierend auf Zieltyp
        let instructionText = "";
        if (this.gameVars.targetType === "anfangsbuchstabe") {
            instructionText = `Schieße auf Ballons mit Wörtern, die mit "${this.gameVars.activeGameData.targetLetter}" beginnen!`;
        } else if (this.gameVars.targetType === "wortart") {
            instructionText = `Schieße auf Ballons mit ${this.gameVars.activeGameData.targetCategory}!`;
        } else {
            instructionText = `Schieße auf Ballons mit Wörtern, die ${this.gameVars.activeGameData.targetSyllables} Silben haben!`;
        }
        
        const instructionHTML = `
            <div class="game-instruction">
                <p>${instructionText}</p>
                <button id="balloon-start-btn" class="kids-button primary">Spiel starten</button>
            </div>
        `;
        
        // Spielbereich
        const gameAreaHTML = `
            <div id="balloon-game-area" class="balloon-game-area">
                <!-- Ballons werden hier dynamisch hinzugefügt -->
            </div>
        `;
        
        // Alles zusammenfügen
        gameElement.innerHTML = headerHTML + instructionHTML + gameAreaHTML;
        
        // Dem Hauptcontainer hinzufügen
        document.getElementById('app').appendChild(gameElement);
        this.gameVars.gameContainer = gameElement;
        
        // Event-Listener für den Start-Button
        document.getElementById('balloon-start-btn').addEventListener('click', () => {
            this.startGame();
        });
    },
    
    /**
     * Startet das Spiel
     */
    startGame: function() {
        // Start-Button und Anleitung ausblenden
        document.querySelector('.game-instruction').style.display = 'none';
        
        // Spielbereich aktivieren
        const gameArea = document.getElementById('balloon-game-area');
        gameArea.classList.add('active');
        
        // Timer starten
        this.startTimer();
        
        // Erste Ballons erstellen
        this.createBalloons(5);
        
        // Regelmäßig neue Ballons hinzufügen
        setInterval(() => {
            if (this.gameVars.balloons.length < 8) {
                this.createBalloons(1);
            }
        }, 2000);
    },
    
    /**
     * Erstellt neue Ballons
     * @param {number} count - Anzahl zu erstellender Ballons
     */
    createBalloons: function(count) {
        const gameArea = document.getElementById('balloon-game-area');
        const allWords = [...this.gameVars.activeGameData.targetWords, ...this.gameVars.activeGameData.otherWords];
        
        for (let i = 0; i < count; i++) {
            if (this.gameVars.balloons.length >= 10) return; // Maximal 10 Ballons gleichzeitig
            
            // Zufälliges Wort auswählen
            const wordIndex = Math.floor(Math.random() * allWords.length);
            const word = allWords[wordIndex];
            
            // Bestimmen, ob es ein Zielwort ist
            let isTarget = false;
            if (this.gameVars.targetType === "anfangsbuchstabe") {
                isTarget = word.toLowerCase().startsWith(this.gameVars.activeGameData.targetLetter.toLowerCase());
            } else if (this.gameVars.targetType === "wortart") {
                isTarget = this.gameVars.activeGameData.targetWords.includes(word);
            } else {
                const syllableCount = this.countSyllables(word);
                isTarget = syllableCount === this.gameVars.activeGameData.targetSyllables;
            }
            
            // Ballon erstellen
            const balloon = document.createElement('div');
            balloon.className = `balloon ${isTarget ? 'target' : 'non-target'}`;
            balloon.dataset.word = word;
            balloon.dataset.isTarget = isTarget;
            
            // Zufällige Position und Farbe
            const left = 10 + Math.random() * 80; // 10-90% vom linken Rand
            balloon.style.left = `${left}%`;
            
            const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
            const colorIndex = Math.floor(Math.random() * colors.length);
            balloon.classList.add(colors[colorIndex]);
            
            // Wort im Ballon anzeigen
            balloon.innerHTML = `<span class="balloon-word">${word}</span>`;
            
            // Ballon zum Spielbereich hinzufügen
            gameArea.appendChild(balloon);
            
            // Animation starten
            setTimeout(() => {
                balloon.style.bottom = '100%';
            }, 50);
            
            // Event-Listener für Klick auf Ballon
            balloon.addEventListener('click', (e) => {
                this.popBalloon(e.currentTarget);
            });
            
            // Ballon zur Liste hinzufügen
            this.gameVars.balloons.push({
                element: balloon,
                word: word,
                isTarget: isTarget
            });
            
            // Ballon nach einer Weile entfernen, wenn er nicht geklickt wurde
            setTimeout(() => {
                if (gameArea.contains(balloon)) {
                    gameArea.removeChild(balloon);
                    this.gameVars.balloons = this.gameVars.balloons.filter(b => b.element !== balloon);
                }
            }, 6000 - (this.gameVars.difficultyLevel * 1000)); // Schneller bei höherer Schwierigkeit
        }
    },
    
    /**
     * Lässt einen Ballon platzen
     * @param {HTMLElement} balloon - Der Ballon-Element
     */
    popBalloon: function(balloon) {
        const isTarget = balloon.dataset.isTarget === 'true';
        
        // Ballon aus dem DOM und der Liste entfernen
        balloon.parentNode.removeChild(balloon);
        this.gameVars.balloons = this.gameVars.balloons.filter(b => b.element !== balloon);
        
        // Punkte vergeben und Sound abspielen
        if (isTarget) {
            this.gameVars.scoreCounter++;
            document.getElementById('balloon-score').textContent = this.gameVars.scoreCounter;
            this.gameVars.soundEffects.pop.play();
            
            // Erfolgsanimation
            const gameArea = document.getElementById('balloon-game-area');
            const popEffect = document.createElement('div');
            popEffect.className = 'pop-effect';
            popEffect.style.left = balloon.style.left;
            popEffect.style.bottom = balloon.style.bottom;
            gameArea.appendChild(popEffect);
            
            setTimeout(() => {
                gameArea.removeChild(popEffect);
            }, 500);
            
            // Prüfen, ob Spielziel erreicht
            if (this.gameVars.scoreCounter >= this.config.targetCount) {
                this.endGame(true);
            }
        } else {
            // Fehlschlag
            this.gameVars.soundEffects.miss.play();
        }
    },
    
    /**
     * Startet den Spieltimer
     */
    startTimer: function() {
        this.gameVars.timer = setInterval(() => {
            this.gameVars.timeRemaining--;
            document.getElementById('balloon-timer').textContent = this.gameVars.timeRemaining;
            
            if (this.gameVars.timeRemaining <= 0) {
                this.endGame(false);
            }
        }, 1000);
    },
    
    /**
     * Beendet das Spiel
     * @param {boolean} success - Ob das Spiel erfolgreich beendet wurde
     */
    endGame: function(success) {
        // Timer stoppen
        clearInterval(this.gameVars.timer);
        
        // Alle Ballons entfernen
        const gameArea = document.getElementById('balloon-game-area');
        gameArea.innerHTML = '';
        
        // Erfolgsmeldung anzeigen
        const resultElement = document.createElement('div');
        resultElement.className = 'game-result';
        
        if (success) {
            resultElement.innerHTML = `
                <h2>Super gemacht! 🎉</h2>
                <p>Du hast alle ${this.config.targetCount} Ballons getroffen!</p>
                <button id="balloon-continue-btn" class="kids-button primary">Weiter</button>
            `;
            this.gameVars.soundEffects.success.play();
        } else {
            resultElement.innerHTML = `
                <h2>Zeit abgelaufen ⏱️</h2>
                <p>Du hast ${this.gameVars.scoreCounter} von ${this.config.targetCount} Ballons getroffen.</p>
                <button id="balloon-retry-btn" class="kids-button primary">Nochmal versuchen</button>
            `;
        }
        
        gameArea.appendChild(resultElement);
        
        // Event-Listener für Buttons
        if (success) {
            document.getElementById('balloon-continue-btn').addEventListener('click', () => {
                this.cleanup();
                this.gameVars.onGameEndCallback(true);
            });
        } else {
            document.getElementById('balloon-retry-btn').addEventListener('click', () => {
                this.cleanup();
                this.init(this.gameVars.activeGameData, this.gameVars.onGameEndCallback);
            });
        }
    },
    
    /**
     * Zählt die Silben in einem Wort
     * @param {string} word - Das zu prüfende Wort
     * @returns {number} - Anzahl der Silben
     */
    countSyllables: function(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        
        // Einfacher Silbenzähler für Deutsch
        word = word.replace(/(?:[^laeiouyäöü]es|[^laeiouyäöü]e)$/, '');
        word = word.replace(/^y/, '');
        
        // Zähle Vokalgruppen
        const syllables = word.match(/[aeiouyäöü]{1,2}/g);
        return syllables ? syllables.length : 1;
    },
    
    /**
     * Behandelt Benutzerinteraktionen
     * @param {string} type - Art der Interaktion
     * @param {Object} data - Zusätzliche Daten zur Interaktion
     */
    handleInteraction: function(type, data) {
        // Spezifische Interaktionslogik hier implementieren
    },
    
    /**
     * Räumt das Spiel auf
     */
    cleanup: function() {
        // Timer stoppen
        if (this.gameVars.timer) {
            clearInterval(this.gameVars.timer);
        }
        
        // Spielcontainer entfernen
        if (this.gameVars.gameContainer && this.gameVars.gameContainer.parentNode) {
            this.gameVars.gameContainer.parentNode.removeChild(this.gameVars.gameContainer);
        }
        
        // Ballons-Liste leeren
        this.gameVars.balloons = [];
    }
};