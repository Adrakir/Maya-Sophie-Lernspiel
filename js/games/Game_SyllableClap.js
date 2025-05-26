/**
 * Silben klatschen - Spiel zur Förderung der Silbenbewusstheit
 * 
 * In diesem Spiel lernen Kinder, Wörter in Silben zu zerlegen und
 * die Silbenstruktur von Wörtern zu erkennen
 */
const Game_SyllableClap = {
    /**
     * Initialisiert das Silbenklatschen-Spiel
     * @param {Object} gameData - Die Spieldaten für den aktuellen Tag/Schwierigkeitsgrad
     * @param {Function} onGameEnd - Callback-Funktion, die nach Spielende aufgerufen wird
     */
    init: function(gameData, onGameEnd) {
        this.gameData = gameData || this.getDefaultGameData();
        this.onGameEnd = onGameEnd;
        this.words = this.gameData.words || [];
        this.images = this.gameData.images || [];
        this.syllableCounts = this.gameData.syllableCounts || [];
        this.currentWordIndex = 0;
        this.score = 0;
        this.maxScore = this.words.length;
        this.attempts = 0;
        this.gameCompleted = false;
        this.userAnswers = [];
        
        // Wird verwendet, um aktuelle Animationen zu verfolgen
        this.isAnimating = false;
        
        this.render();
        this.setupEventListeners();
        
        // Log für Debugging
        console.log("SyllableClap initialized with words:", this.words);
    },
    
    /**
     * Standarddaten für das Spiel, falls keine spezifischen Daten übergeben werden
     */
    getDefaultGameData: function() {
        return {
            words: ["Mama", "Papa", "Hase", "Katze", "Elefant", "Giraffe", "Banane"],
            images: ["👩", "👨", "🐰", "🐱", "🐘", "🦒", "🍌"],
            syllableCounts: [2, 2, 2, 2, 3, 3, 3]
        };
    },
    
    /**
     * Rendert die Benutzeroberfläche des Spiels
     */
    render: function() {
        const container = document.getElementById('game-container');
        if (!container) {
            console.error("Game container not found");
            return;
        }
        
        container.innerHTML = '';
        
        // Titel und Anleitung
        const header = document.createElement('div');
        header.className = 'game-header text-center mb-6';
        header.innerHTML = `
            <h2 class="text-2xl font-bold text-purple-600 mb-2">Silben klatschen</h2>
            <p class="text-gray-700">Klatsche oder tippe für jede Silbe im Wort einmal!</p>
        `;
        container.appendChild(header);
        
        // Wenn das Spiel abgeschlossen ist, zeigen wir das Ergebnis an
        if (this.gameCompleted) {
            this.renderGameResults(container);
            return;
        }
        
        // Fortschrittsanzeige
        const progress = document.createElement('div');
        progress.className = 'progress-container mb-4';
        progress.innerHTML = `
            <div class="flex justify-between mb-2">
                <span>Fortschritt</span>
                <span>${this.currentWordIndex + 1} von ${this.words.length}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${((this.currentWordIndex) / this.words.length) * 100}%"></div>
            </div>
        `;
        container.appendChild(progress);
        
        // Punkteanzeige
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'score-display text-center mb-6';
        scoreDisplay.innerHTML = `
            <p>Punkte: <span class="font-bold text-purple-600">${this.score}</span></p>
        `;
        container.appendChild(scoreDisplay);
        
        // Aktuelles Wort
        const currentWord = this.words[this.currentWordIndex];
        const currentImage = this.images[this.currentWordIndex];
        
        const wordDisplay = document.createElement('div');
        wordDisplay.className = 'word-display text-center mb-8';
        wordDisplay.innerHTML = `
            <div class="text-6xl mb-4 animate-bounce">${currentImage}</div>
            <div class="word-container">
                <p class="text-3xl font-bold text-purple-600">${currentWord}</p>
                <button class="sound-btn mt-2" id="play-word-btn">
                    <span class="sound-icon">🔊</span> Vorlesen
                </button>
            </div>
        `;
        container.appendChild(wordDisplay);
        
        // Interaktionsbereich
        const interactionArea = document.createElement('div');
        interactionArea.className = 'interaction-area flex flex-col items-center justify-center mb-6';
        
        // Silben-Visualisierung
        const syllableVisualization = document.createElement('div');
        syllableVisualization.className = 'syllable-viz flex justify-center items-center gap-4 mb-6';
        syllableVisualization.id = 'syllable-viz';
        
        // Für jede Silbe, die der Benutzer eingegeben hat, fügen wir ein Element hinzu
        if (this.userAnswers.length > 0) {
            for (let i = 0; i < this.userAnswers.length; i++) {
                const syllableSpan = document.createElement('span');
                syllableSpan.className = 'syllable-bubble text-xl bg-purple-100 text-purple-800 px-4 py-2 rounded-full pop-in';
                syllableSpan.textContent = "👏";
                syllableVisualization.appendChild(syllableSpan);
            }
        }
        
        interactionArea.appendChild(syllableVisualization);
        
        // Klatschen-Button
        const clapButton = document.createElement('button');
        clapButton.className = 'kids-button primary text-xl px-8 py-4 mb-4';
        clapButton.id = 'clap-btn';
        clapButton.innerHTML = `<span class="mr-2">👏</span> Klatschen!`;
        interactionArea.appendChild(clapButton);
        
        // Antwort überprüfen
        const checkButton = document.createElement('button');
        checkButton.className = 'btn btn-secondary';
        checkButton.id = 'check-btn';
        checkButton.textContent = 'Überprüfen';
        checkButton.disabled = this.userAnswers.length === 0;
        checkButton.style.opacity = this.userAnswers.length === 0 ? '0.5' : '1';
        interactionArea.appendChild(checkButton);
        
        container.appendChild(interactionArea);
        
        // Hilfe für Eltern
        const helpForParents = document.createElement('div');
        helpForParents.className = 'help-for-parents mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700';
        helpForParents.innerHTML = `
            <h3 class="font-bold mb-2">Info für Eltern:</h3>
            <p>Bei diesem Spiel geht es darum, Wörter in Silben zu zerlegen. Dies fördert die phonologische Bewusstheit, 
            eine wichtige Voraussetzung für das Lesenlernen. Unterstützen Sie Ihr Kind, indem Sie gemeinsam die Wörter 
            in Silben klatschen. Beispiel: "Ma-ma" = 2 Silben, "E-le-fant" = 3 Silben.</p>
        `;
        container.appendChild(helpForParents);
        
        // Reset- und Hilfe-Buttons
        const buttonBar = document.createElement('div');
        buttonBar.className = 'button-bar flex justify-between mt-6';
        buttonBar.innerHTML = `
            <button id="reset-btn" class="btn btn-secondary">Zurücksetzen</button>
            <button id="help-btn" class="btn btn-accent">Hilfe</button>
        `;
        container.appendChild(buttonBar);
    },
    
    /**
     * Rendert das Spielergebnis nach Abschluss aller Wörter
     * @param {HTMLElement} container - Der Container, in dem das Ergebnis angezeigt wird
     */
    renderGameResults: function(container) {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'game-results text-center p-6 bg-white rounded-lg shadow-md';
        
        // Erfolgsgrad bestimmen
        const successRate = this.score / this.maxScore;
        let feedbackMessage, feedbackIcon;
        
        if (successRate >= 0.8) {
            feedbackMessage = "Fantastisch! Du bist ein Silben-Meister!";
            feedbackIcon = "🌟";
        } else if (successRate >= 0.6) {
            feedbackMessage = "Gut gemacht! Du wirst immer besser mit Silben!";
            feedbackIcon = "👍";
        } else {
            feedbackMessage = "Weiter üben! Mit der Zeit wirst du besser werden!";
            feedbackIcon = "💪";
        }
        
        resultsDiv.innerHTML = `
            <div class="text-5xl mb-4">${feedbackIcon}</div>
            <h2 class="text-2xl font-bold text-purple-600 mb-4">Spielergebnis</h2>
            <div class="score-result mb-6">
                <span class="text-4xl font-bold text-purple-600">${this.score}</span>
                <span class="text-xl text-gray-600"> von ${this.maxScore} Punkten</span>
            </div>
            <p class="mb-6 text-lg">${feedbackMessage}</p>
            <button id="replay-btn" class="kids-button mr-4">Nochmal spielen</button>
            <button id="finish-btn" class="kids-button primary">Spiel beenden</button>
        `;
        
        container.appendChild(resultsDiv);
        
        // Konfetti-Effekt für gute Ergebnisse
        if (successRate >= 0.6) {
            this.createConfetti(container);
        }
        
        // Event-Listener für die Buttons hinzufügen
        document.getElementById('replay-btn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('finish-btn').addEventListener('click', () => {
            this.onGameEnd(successRate >= 0.5); // Spiel gilt als bestanden, wenn mind. 50% der Punkte erreicht wurden
        });
    },
    
    /**
     * Erstellt einen Konfetti-Effekt für Erfolgserlebnisse
     * @param {HTMLElement} container - Der Container, in dem der Konfetti-Effekt angezeigt wird
     */
    createConfetti: function(container) {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.position = 'absolute';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '1';
        
        container.appendChild(confettiContainer);
        
        const colors = ['#ff69b4', '#64b5f6', '#ffde59', '#66bb6a', '#9c27b0'];
        
        // 50 Konfetti-Teilchen erstellen
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.position = 'absolute';
                confetti.style.top = '0';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.width = Math.random() * 10 + 5 + 'px';
                confetti.style.height = Math.random() * 10 + 5 + 'px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                confetti.style.animation = `confetti ${Math.random() * 3 + 2}s ease-in forwards`;
                
                confettiContainer.appendChild(confetti);
                
                // Konfetti nach der Animation entfernen
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }, Math.random() * 500);
        }
    },
    
    /**
     * Richtet Event-Listener für die Spielinteraktionen ein
     */
    setupEventListeners: function() {
        // Klatschen-Button
        const clapButton = document.getElementById('clap-btn');
        if (clapButton) {
            clapButton.addEventListener('click', () => {
                this.handleClap();
            });
        }
        
        // Überprüfen-Button
        const checkButton = document.getElementById('check-btn');
        if (checkButton) {
            checkButton.addEventListener('click', () => {
                this.checkAnswer();
            });
        }
        
        // Vorlese-Button
        const playWordButton = document.getElementById('play-word-btn');
        if (playWordButton) {
            playWordButton.addEventListener('click', () => {
                const currentWord = this.words[this.currentWordIndex];
                AudioManager.speak(currentWord);
            });
        }
        
        // Reset-Button
        const resetButton = document.getElementById('reset-btn');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetCurrentWord();
            });
        }
        
        // Hilfe-Button
        const helpButton = document.getElementById('help-btn');
        if (helpButton) {
            helpButton.addEventListener('click', () => {
                this.showHelp();
            });
        }
        
        // Tastatur-Events für Desktop
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.gameCompleted) {
                this.handleClap();
                e.preventDefault(); // Verhindert Scrollen bei Leertaste
            }
        });
    },
    
    /**
     * Behandelt einen Klatschen-Klick
     */
    handleClap: function() {
        if (this.isAnimating || this.gameCompleted) return;
        
        this.isAnimating = true;
        
        // Klatschen-Sound abspielen
        AudioManager.playSound('clap');
        
        // Klatschen zur Antwort hinzufügen
        this.userAnswers.push(1);
        
        // Silben-Visualisierung aktualisieren
        const syllableViz = document.getElementById('syllable-viz');
        if (syllableViz) {
            const syllableSpan = document.createElement('span');
            syllableSpan.className = 'syllable-bubble text-xl bg-purple-100 text-purple-800 px-4 py-2 rounded-full';
            syllableSpan.textContent = "👏";
            syllableSpan.style.animationName = 'popIn';
            syllableSpan.style.animationDuration = '0.5s';
            syllableViz.appendChild(syllableSpan);
            
            // Button aktivieren, wenn mindestens ein Klatschen erfolgt ist
            const checkButton = document.getElementById('check-btn');
            if (checkButton) {
                checkButton.disabled = false;
                checkButton.style.opacity = '1';
            }
        }
        
        // Animation abgeschlossen
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    },
    
    /**
     * Überprüft die vom Benutzer eingegebene Antwort
     */
    checkAnswer: function() {
        if (this.isAnimating || this.gameCompleted) return;
        
        const correctSyllableCount = this.syllableCounts[this.currentWordIndex];
        const userSyllableCount = this.userAnswers.length;
        
        this.attempts++;
        
        if (userSyllableCount === correctSyllableCount) {
            // Richtige Antwort
            this.score++;
            this.showFeedback(true);
            
            // Zum nächsten Wort gehen
            setTimeout(() => {
                this.goToNextWord();
            }, 1500);
        } else {
            // Falsche Antwort
            this.showFeedback(false, correctSyllableCount);
            
            // Aktuelles Wort zurücksetzen
            setTimeout(() => {
                this.resetCurrentWord();
            }, 2000);
        }
    },
    
    /**
     * Zeigt Feedback basierend auf der Antwort des Benutzers
     * @param {boolean} isCorrect - Ob die Antwort korrekt war
     * @param {number} correctCount - Die korrekte Anzahl der Silben (bei falscher Antwort)
     */
    showFeedback: function(isCorrect, correctCount) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback-message ${isCorrect ? 'success' : 'error'} fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-6 rounded-lg shadow-lg text-center max-w-sm`;
        
        if (isCorrect) {
            const correctMessages = [
                "Super! 👏 Das ist richtig!",
                "Toll gemacht! 🎉 Richtige Anzahl an Silben!",
                "Perfekt! 🌟 Du bist ein Silben-Meister!",
                "Genau richtig! ⭐ Weiter so!"
            ];
            
            const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
            feedbackDiv.innerHTML = `
                <div class="text-4xl mb-3">✅</div>
                <p class="text-xl font-bold text-green-600">${randomMessage}</p>
            `;
            
            // Erfolgs-Sound abspielen
            AudioManager.playSound('success');
        } else {
            const encouragingMessages = [
                "Fast! 💪 Versuch es noch einmal!",
                "Nicht ganz! 🤔 Klatschen wir zusammen!",
                "Fast richtig! 🌱 Hör genau hin!",
                "Das können wir üben! 🔄 Noch einmal!"
            ];
            
            const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
            feedbackDiv.innerHTML = `
                <div class="text-4xl mb-3">🤗</div>
                <p class="text-xl font-bold text-orange-600">${randomMessage}</p>
                <p class="mt-2">Das Wort hat ${correctCount} Silben.</p>
            `;
            
            // Hinweis-Sound abspielen
            AudioManager.playSound('hint');
        }
        
        document.body.appendChild(feedbackDiv);
        
        // Feedback nach kurzer Zeit entfernen
        setTimeout(() => {
            feedbackDiv.style.opacity = '0';
            feedbackDiv.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.removeChild(feedbackDiv);
            }, 500);
        }, 1500);
    },
    
    /**
     * Wechselt zum nächsten Wort oder beendet das Spiel
     */
    goToNextWord: function() {
        this.currentWordIndex++;
        this.userAnswers = [];
        
        if (this.currentWordIndex >= this.words.length) {
            // Spiel ist abgeschlossen
            this.gameCompleted = true;
        }
        
        this.render();
    },
    
    /**
     * Setzt das aktuelle Wort zurück (löscht Benutzerantworten)
     */
    resetCurrentWord: function() {
        this.userAnswers = [];
        this.render();
    },
    
    /**
     * Setzt das gesamte Spiel zurück
     */
    resetGame: function() {
        this.currentWordIndex = 0;
        this.score = 0;
        this.attempts = 0;
        this.userAnswers = [];
        this.gameCompleted = false;
        this.render();
    },
    
    /**
     * Zeigt einen Hilfe-Dialog für das Spiel an
     */
    showHelp: function() {
        UIManager.showModal(
            "Hilfe: Silben klatschen",
            `
            <div class="help-content">
                <p class="mb-4">Bei diesem Spiel lernst du, Wörter in Silben zu zerlegen.</p>
                
                <h3 class="font-bold mb-2">So geht's:</h3>
                <ol class="list-decimal pl-5 mb-4 space-y-2">
                    <li>Schau dir das Wort an und höre es dir an (klicke auf 🔊)</li>
                    <li>Klatsche einmal für jede Silbe im Wort (oder drücke den Klatschen-Button)</li>
                    <li>Klicke auf "Überprüfen", um zu sehen, ob du richtig liegst</li>
                </ol>
                
                <h3 class="font-bold mb-2">Beispiele:</h3>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><strong>Ma-ma</strong> hat 2 Silben → Klatsche zweimal</li>
                    <li><strong>E-le-fant</strong> hat 3 Silben → Klatsche dreimal</li>
                    <li><strong>Schrank</strong> hat 1 Silbe → Klatsche einmal</li>
                </ul>
                
                <p class="mt-4">Tipp: Sprich das Wort langsam und deutlich aus. Bei jeder Silbe öffnet sich dein Mund einmal.</p>
            </div>
            `,
            "Verstanden"
        );
    },
    
    /**
     * Bereinigt Ressourcen, wenn das Spiel beendet wird
     */
    cleanup: function() {
        // Event-Listener entfernen, falls nötig
        document.removeEventListener('keydown', this.handleKeyDown);
    }
};