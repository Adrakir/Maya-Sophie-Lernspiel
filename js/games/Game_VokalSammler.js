/**
 * Game_VokalSammler.js
 * 
 * Spielmodul: Vokal-Sammler
 * Kinder sammeln Vokale, um Wörter zu vervollständigen
 */
const Game_VokalSammler = {
    /**
     * Spielkonfiguration
     */
    config: {
        gameName: "Vokal-Sammler",
        gameIcon: "🔤",
        maxTime: 90, // Sekunden
        wordCount: 5, // Anzahl zu vervollständigender Wörter
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
        currentWordIndex: 0,
        currentWord: "",
        currentWordWithMissingVowels: "",
        missingVowels: [],
        collectedVowels: [],
        characterPosition: { x: 50, y: 80 }, // Position des Charakters in %
        fallingVowels: [],
        difficultyLevel: 1,
        onGameEndCallback: null,
        soundEffects: {
            collect: new Audio('assets/sounds/collect.mp3'),
            complete: new Audio('assets/sounds/word-complete.mp3'),
            success: new Audio('assets/sounds/success.mp3')
        }
    },
    
    /**
     * Initialisiert das Spiel
     * @param {Object} gameData - Spieldaten mit Wörtern und Schwierigkeitsgrad
     * @param {Function} onGameEnd - Callback bei Spielende
     */
    init: function(gameData, onGameEnd) {
        console.log("Initialisiere Vokal-Sammler Spiel...");
        
        // Spielvariablen zurücksetzen
        this.gameVars.activeGameData = gameData;
        this.gameVars.scoreCounter = 0;
        this.gameVars.timeRemaining = this.config.maxTime;
        this.gameVars.onGameEndCallback = onGameEnd;
        this.gameVars.difficultyLevel = gameData.difficulty || 1;
        this.gameVars.currentWordIndex = 0;
        this.gameVars.collectedVowels = [];
        this.gameVars.fallingVowels = [];
        
        // Erstes Wort vorbereiten
        this.prepareNextWord();
        
        // Spielcontainer erstellen
        this.render();
        
        // Anleitung vorlesen
        const instructionText = `Sammle die richtigen Vokale, um die Wörter zu vervollständigen. Bewege den Charakter mit den Pfeiltasten oder durch Tippen.`;
        AudioManager.speak(instructionText);
    },
    
    /**
     * Bereitet das nächste Wort vor
     */
    prepareNextWord: function() {
        const wordList = this.gameVars.activeGameData.words;
        this.gameVars.currentWord = wordList[this.gameVars.currentWordIndex];
        
        // Vokale im Wort identifizieren
        const vowels = ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü'];
        this.gameVars.missingVowels = [];
        
        // Je nach Schwierigkeit unterschiedlich viele Vokale entfernen
        let wordWithMissingVowels = this.gameVars.currentWord;
        const vowelsInWord = [];
        
        // Alle Vokale im Wort finden
        for (let i = 0; i < this.gameVars.currentWord.length; i++) {
            const char = this.gameVars.currentWord[i].toLowerCase();
            if (vowels.includes(char)) {
                vowelsInWord.push({
                    index: i,
                    vowel: this.gameVars.currentWord[i]
                });
            }
        }
        
        // Anzahl zu entfernender Vokale basierend auf Schwierigkeit
        let vowelsToRemove = 0;
        if (this.gameVars.difficultyLevel === 1) {
            vowelsToRemove = Math.min(2, vowelsInWord.length);
        } else if (this.gameVars.difficultyLevel === 2) {
            vowelsToRemove = Math.min(3, vowelsInWord.length);
        } else {
            vowelsToRemove = vowelsInWord.length;
        }
        
        // Zufällige Vokale entfernen
        const indicesToRemove = [];
        while (indicesToRemove.length < vowelsToRemove && vowelsInWord.length > 0) {
            const randomIndex = Math.floor(Math.random() * vowelsInWord.length);
            const vowelInfo = vowelsInWord.splice(randomIndex, 1)[0];
            indicesToRemove.push(vowelInfo.index);
            this.gameVars.missingVowels.push(vowelInfo.vowel);
        }
        
        // Wort mit fehlenden Vokalen erstellen
        let result = '';
        for (let i = 0; i < this.gameVars.currentWord.length; i++) {
            if (indicesToRemove.includes(i)) {
                result += '_';
            } else {
                result += this.gameVars.currentWord[i];
            }
        }
        
        this.gameVars.currentWordWithMissingVowels = result;
        this.gameVars.collectedVowels = [];
        
        console.log("Wort vorbereitet:", this.gameVars.currentWord);
        console.log("Mit fehlenden Vokalen:", this.gameVars.currentWordWithMissingVowels);
        console.log("Fehlende Vokale:", this.gameVars.missingVowels);
    },
    
    /**
     * Rendert die Spieloberfläche
     */
    render: function() {
        // Spielcontainer erstellen
        const gameElement = document.createElement('div');
        gameElement.id = 'vowel-collector-game';
        gameElement.className = 'game-container vowel-game';
        
        // Header mit Spielinfo
        const headerHTML = `
            <div class="game-header">
                <div class="game-score">Wörter: <span id="vowel-score">0</span> / ${this.config.wordCount}</div>
                <div class="game-timer">Zeit: <span id="vowel-timer">${this.config.maxTime}</span>s</div>
            </div>
        `;
        
        // Anleitung
        const instructionHTML = `
            <div class="game-instruction">
                <p>Sammle die richtigen Vokale, um die Wörter zu vervollständigen!</p>
                <button id="vowel-start-btn" class="kids-button primary">Spiel starten</button>
            </div>
        `;
        
        // Spielbereich
        const gameAreaHTML = `
            <div id="vowel-game-area" class="vowel-game-area">
                <div id="word-display" class="word-display">${this.gameVars.currentWordWithMissingVowels}</div>
                <div id="collected-vowels" class="collected-vowels"></div>
                <div id="character" class="character">🧒</div>
                <!-- Fallende Vokale werden hier dynamisch hinzugefügt -->
            </div>
        `;
        
        // Steuerung für Mobilgeräte
        const controlsHTML = `
            <div id="mobile-controls" class="mobile-controls">
                <button id="move-left" class="control-button">⬅️</button>
                <button id="move-right" class="control-button">➡️</button>
            </div>
        `;
        
        // Alles zusammenfügen
        gameElement.innerHTML = headerHTML + instructionHTML + gameAreaHTML + controlsHTML;
        
        // Dem Hauptcontainer hinzufügen
        document.getElementById('app').appendChild(gameElement);
        this.gameVars.gameContainer = gameElement;
        
        // Event-Listener für den Start-Button
        document.getElementById('vowel-start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Event-Listener für mobile Steuerung
        document.getElementById('move-left').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveCharacter('left');
        });
        
        document.getElementById('move-right').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveCharacter('right');
        });
    },
    
    /**
     * Startet das Spiel
     */
    startGame: function() {
        // Start-Button und Anleitung ausblenden
        document.querySelector('.game-instruction').style.display = 'none';
        
        // Spielbereich aktivieren
        const gameArea = document.getElementById('vowel-game-area');
        gameArea.classList.add('active');
        
        // Tastatursteuerung einrichten
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Timer starten
        this.startTimer();
        
        // Vokale fallen lassen
        this.startVowelDrop();
        
        // Kollisionserkennung starten
        this.startCollisionDetection();
    },
    
    /**
     * Startet das regelmäßige Fallenlassen von Vokalen
     */
    startVowelDrop: function() {
        // Alle Vokale und ein paar andere Buchstaben für die Schwierigkeit
        const allVowels = ['A', 'E', 'I', 'O', 'U', 'Ä', 'Ö', 'Ü'];
        const otherLetters = ['B', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W', 'Z'];
        
        // Interval basierend auf Schwierigkeit
        const intervalTime = 1500 - (this.gameVars.difficultyLevel * 300);
        
        const dropInterval = setInterval(() => {
            if (this.gameVars.timeRemaining <= 0) {
                clearInterval(dropInterval);
                return;
            }
            
            // Entscheiden, ob ein Vokal oder ein anderer Buchstabe fällt
            let letter;
            if (Math.random() < 0.7) { // 70% Wahrscheinlichkeit für einen Vokal
                // 50% Wahrscheinlichkeit für einen benötigten Vokal, wenn noch welche fehlen
                if (this.gameVars.missingVowels.length > 0 && Math.random() < 0.5) {
                    const randomIndex = Math.floor(Math.random() * this.gameVars.missingVowels.length);
                    letter = this.gameVars.missingVowels[randomIndex].toUpperCase();
                } else {
                    letter = allVowels[Math.floor(Math.random() * allVowels.length)];
                }
            } else {
                letter = otherLetters[Math.floor(Math.random() * otherLetters.length)];
            }
            
            // Zufällige horizontale Position
            const left = 5 + Math.random() * 90; // 5-95% vom linken Rand
            
            // Vokal-Element erstellen
            const vowelElement = document.createElement('div');
            vowelElement.className = 'falling-vowel';
            vowelElement.textContent = letter;
            vowelElement.style.left = `${left}%`;
            vowelElement.style.top = '0%';
            
            // Zum Spielbereich hinzufügen
            document.getElementById('vowel-game-area').appendChild(vowelElement);
            
            // Zur Liste hinzufügen
            this.gameVars.fallingVowels.push({
                element: vowelElement,
                letter: letter,
                position: { x: left, y: 0 }
            });
            
            // Animation starten
            requestAnimationFrame(this.animateVowels.bind(this));
            
        }, intervalTime);
    },
    
    /**
     * Animiert die fallenden Vokale
     */
    animateVowels: function() {
        const gameArea = document.getElementById('vowel-game-area');
        const gameAreaRect = gameArea.getBoundingClientRect();
        const fallSpeed = 1 + (this.gameVars.difficultyLevel * 0.5); // Schneller bei höherer Schwierigkeit
        
        // Für jeden fallenden Vokal
        for (let i = 0; i < this.gameVars.fallingVowels.length; i++) {
            const vowel = this.gameVars.fallingVowels[i];
            
            // Position aktualisieren
            vowel.position.y += fallSpeed;
            vowel.element.style.top = `${vowel.position.y}%`;
            
            // Vokal entfernen, wenn er aus dem Bildschirm fällt
            if (vowel.position.y > 100) {
                gameArea.removeChild(vowel.element);
                this.gameVars.fallingVowels.splice(i, 1);
                i--;
            }
        }
        
        // Animation fortsetzen
        if (this.gameVars.fallingVowels.length > 0 && this.gameVars.timeRemaining > 0) {
            requestAnimationFrame(this.animateVowels.bind(this));
        }
    },
    
    /**
     * Startet die Kollisionserkennung zwischen Charakter und Vokalen
     */
    startCollisionDetection: function() {
        const checkCollisions = () => {
            if (this.gameVars.timeRemaining <= 0) return;
            
            const character = document.getElementById('character');
            const characterRect = character.getBoundingClientRect();
            
            // Für jeden fallenden Vokal
            for (let i = 0; i < this.gameVars.fallingVowels.length; i++) {
                const vowel = this.gameVars.fallingVowels[i];
                const vowelRect = vowel.element.getBoundingClientRect();
                
                // Kollisionserkennung
                if (!(characterRect.right < vowelRect.left || 
                      characterRect.left > vowelRect.right || 
                      characterRect.bottom < vowelRect.top || 
                      characterRect.top > vowelRect.bottom)) {
                    
                    // Kollision! Vokal einsammeln
                    this.collectVowel(vowel);
                    break;
                }
            }
            
            // Weiter prüfen
            requestAnimationFrame(checkCollisions);
        };
        
        // Kollisionserkennung starten
        requestAnimationFrame(checkCollisions);
    },
    
    /**
     * Sammelt einen Vokal ein
     * @param {Object} vowel - Das Vokal-Objekt
     */
    collectVowel: function(vowel) {
        const gameArea = document.getElementById('vowel-game-area');
        
        // Vokal aus dem Spielbereich entfernen
        gameArea.removeChild(vowel.element);
        this.gameVars.fallingVowels = this.gameVars.fallingVowels.filter(v => v !== vowel);
        
        // Prüfen, ob der Vokal benötigt wird
        const isNeeded = this.gameVars.missingVowels.some(v => v.toUpperCase() === vowel.letter);
        
        if (isNeeded && !this.gameVars.collectedVowels.includes(vowel.letter)) {
            // Benötigten Vokal einsammeln
            this.gameVars.collectedVowels.push(vowel.letter);
            this.gameVars.soundEffects.collect.play();
            
            // Eingesammelten Vokal anzeigen
            this.updateCollectedVowels();
            
            // Prüfen, ob alle benötigten Vokale gesammelt wurden
            if (this.gameVars.collectedVowels.length >= this.gameVars.missingVowels.length) {
                this.completeWord();
            }
        }
    },
    
    /**
     * Aktualisiert die Anzeige der eingesammelten Vokale
     */
    updateCollectedVowels: function() {
        const collectedContainer = document.getElementById('collected-vowels');
        collectedContainer.innerHTML = '';
        
        for (const vowel of this.gameVars.collectedVowels) {
            const vowelSpan = document.createElement('span');
            vowelSpan.className = 'collected-vowel';
            vowelSpan.textContent = vowel;
            collectedContainer.appendChild(vowelSpan);
        }
    },
    
    /**
     * Vervollständigt das aktuelle Wort
     */
    completeWord: function() {
        // Wort-Animation
        const wordDisplay = document.getElementById('word-display');
        wordDisplay.textContent = this.gameVars.currentWord;
        wordDisplay.classList.add('word-completed');
        
        // Sound abspielen
        this.gameVars.soundEffects.complete.play();
        
        // Punkte erhöhen
        this.gameVars.scoreCounter++;
        document.getElementById('vowel-score').textContent = this.gameVars.scoreCounter;
        
        // Prüfen, ob Spielziel erreicht
        if (this.gameVars.scoreCounter >= this.config.wordCount) {
            this.endGame(true);
            return;
        }
        
        // Kurze Pause, dann nächstes Wort
        setTimeout(() => {
            wordDisplay.classList.remove('word-completed');
            this.gameVars.currentWordIndex++;
            
            // Zurück zum ersten Wort, wenn alle durch sind
            if (this.gameVars.currentWordIndex >= this.gameVars.activeGameData.words.length) {
                this.gameVars.currentWordIndex = 0;
            }
            
            this.prepareNextWord();
            wordDisplay.textContent = this.gameVars.currentWordWithMissingVowels;
            
            // Gesammelte Vokale zurücksetzen
            this.gameVars.collectedVowels = [];
            this.updateCollectedVowels();
        }, 1500);
    },
    
    /**
     * Bewegt den Charakter
     * @param {string} direction - Richtung ('left' oder 'right')
     */
    moveCharacter: function(direction) {
        const character = document.getElementById('character');
        const moveAmount = 5; // Bewegungsgeschwindigkeit in %
        
        if (direction === 'left') {
            this.gameVars.characterPosition.x = Math.max(0, this.gameVars.characterPosition.x - moveAmount);
        } else if (direction === 'right') {
            this.gameVars.characterPosition.x = Math.min(95, this.gameVars.characterPosition.x + moveAmount);
        }
        
        character.style.left = `${this.gameVars.characterPosition.x}%`;
    },
    
    /**
     * Behandelt Tastatureingaben
     * @param {KeyboardEvent} e - Das Tastaturereignis
     */
    handleKeyDown: function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            this.moveCharacter('left');
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            this.moveCharacter('right');
        }
    },
    
    /**
     * Startet den Spieltimer
     */
    startTimer: function() {
        this.gameVars.timer = setInterval(() => {
            this.gameVars.timeRemaining--;
            document.getElementById('vowel-timer').textContent = this.gameVars.timeRemaining;
            
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
        
        // Tastatursteuerung entfernen
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Alle fallenden Vokale entfernen
        const gameArea = document.getElementById('vowel-game-area');
        for (const vowel of this.gameVars.fallingVowels) {
            if (vowel.element.parentNode) {
                vowel.element.parentNode.removeChild(vowel.element);
            }
        }
        this.gameVars.fallingVowels = [];
        
        // Erfolgsmeldung anzeigen
        const resultElement = document.createElement('div');
        resultElement.className = 'game-result';
        
        if (success) {
            resultElement.innerHTML = `
                <h2>Super gemacht! 🎉</h2>
                <p>Du hast alle ${this.config.wordCount} Wörter vervollständigt!</p>
                <button id="vowel-continue-btn" class="kids-button primary">Weiter</button>
            `;
            this.gameVars.soundEffects.success.play();
        } else {
            resultElement.innerHTML = `
                <h2>Zeit abgelaufen ⏱️</h2>
                <p>Du hast ${this.gameVars.scoreCounter} von ${this.config.wordCount} Wörtern vervollständigt.</p>
                <button id="vowel-retry-btn" class="kids-button primary">Nochmal versuchen</button>
            `;
        }
        
        gameArea.appendChild(resultElement);
        
        // Event-Listener für Buttons
        if (success) {
            document.getElementById('vowel-continue-btn').addEventListener('click', () => {
                this.cleanup();
                this.gameVars.onGameEndCallback(true);
            });
        } else {
            document.getElementById('vowel-retry-btn').addEventListener('click', () => {
                this.cleanup();
                this.init(this.gameVars.activeGameData, this.gameVars.onGameEndCallback);
            });
        }
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
        
        // Tastatursteuerung entfernen
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Spielcontainer entfernen
        if (this.gameVars.gameContainer && this.gameVars.gameContainer.parentNode) {
            this.gameVars.gameContainer.parentNode.removeChild(this.gameVars.gameContainer);
        }
        
        // Fallende Vokale leeren
        this.gameVars.fallingVowels = [];
    }
};