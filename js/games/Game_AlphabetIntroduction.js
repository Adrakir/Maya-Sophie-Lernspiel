/**
 * Alphabet Introduction Game Module
 * 
 * Dieses Modul führt neue Buchstaben ein und enthält ein Memory-Spiel zur Festigung
 * Es stellt sowohl die visuelle als auch auditive Repräsentation der Buchstaben vor
 */
const Game_AlphabetIntroduction = {
    /**
     * Initialisiert das Buchstaben-Einführungsspiel
     * @param {Object} gameData - Daten für das aktuelle Spiel (Buchstaben, Wörter, etc.)
     * @param {Function} onGameEnd - Callback-Funktion, die nach Spielende aufgerufen wird
     */
    init: function(gameData, onGameEnd) {
        this.gameData = gameData;
        this.onGameEnd = onGameEnd;
        this.currentLetters = gameData.letters || ['A', 'B', 'C'];
        this.currentWords = gameData.words || ['Apfel', 'Ball', 'Computer'];
        this.currentImages = gameData.images || ['🍎', '⚽', '💻'];
        this.currentStep = 'introduction'; // 'introduction', 'memory', 'completed'
        this.selectedCards = [];
        this.matchedPairs = [];
        this.attempts = 0;
        this.render();
    },

    /**
     * Rendert das Spiel basierend auf dem aktuellen Schritt
     */
    render: function() {
        const container = document.getElementById('game-container');
        container.innerHTML = '';
        
        if (this.currentStep === 'introduction') {
            this.renderIntroduction(container);
        } else if (this.currentStep === 'memory') {
            this.renderMemoryGame(container);
        } else if (this.currentStep === 'completed') {
            this.renderCompletion(container);
        }
    },
    
    /**
     * Rendert die Buchstabeneinführung mit Beispielen
     * @param {HTMLElement} container - Der Container, in dem das Spiel gerendert wird
     */
    renderIntroduction: function(container) {
        const introDiv = document.createElement('div');
        introDiv.className = 'text-center p-4';
        
        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold text-purple-600 mb-4';
        title.textContent = 'Neue Buchstaben kennenlernen';
        introDiv.appendChild(title);
        
        const lettersContainer = document.createElement('div');
        lettersContainer.className = 'flex flex-wrap justify-center gap-4 mb-8';
        
        this.currentLetters.forEach((letter, index) => {
            const letterCard = document.createElement('div');
            letterCard.className = 'character-card flex flex-col items-center w-32 cursor-pointer';
            letterCard.innerHTML = `
                <div class="text-5xl font-bold text-purple-600 letter-animation">${letter}</div>
                <div class="text-xl mt-2">${letter.toLowerCase()}</div>
                <div class="text-3xl mt-3">${this.currentImages[index]}</div>
                <div class="mt-2 font-medium">${this.currentWords[index]}</div>
            `;
            letterCard.addEventListener('click', () => {
                AudioManager.speak(`${letter} wie ${this.currentWords[index]}`);
            });
            lettersContainer.appendChild(letterCard);
        });
        
        introDiv.appendChild(lettersContainer);
        
        const instruction = document.createElement('p');
        instruction.className = 'mb-4 text-gray-700';
        instruction.textContent = 'Klicke auf die Buchstaben, um sie zu hören. Wenn du bereit bist, kannst du zum Memory-Spiel weitergehen.';
        introDiv.appendChild(instruction);
        
        const nextButton = document.createElement('button');
        nextButton.className = 'game-button mt-4';
        nextButton.textContent = 'Zum Memory-Spiel';
        nextButton.addEventListener('click', () => {
            this.currentStep = 'memory';
            this.render();
        });
        introDiv.appendChild(nextButton);
        
        container.appendChild(introDiv);
    },
    
    /**
     * Rendert das Memory-Spiel mit den eingeführten Buchstaben
     * @param {HTMLElement} container - Der Container, in dem das Spiel gerendert wird
     */
    renderMemoryGame: function(container) {
        const memoryDiv = document.createElement('div');
        memoryDiv.className = 'text-center p-4';
        
        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold text-purple-600 mb-4';
        title.textContent = 'Buchstaben-Memory';
        memoryDiv.appendChild(title);
        
        const instruction = document.createElement('p');
        instruction.className = 'mb-4 text-gray-700';
        instruction.textContent = 'Finde die passenden Paare! Drehe zwei Karten um und schau, ob sie zusammengehören.';
        memoryDiv.appendChild(instruction);
        
        // Erstelle Memory-Karten (Buchstaben mit ihren Bildern oder Groß-/Kleinbuchstaben)
        const memoryPairs = [];
        this.currentLetters.forEach((letter, index) => {
            memoryPairs.push({
                id: `${letter}-upper`,
                content: letter,
                type: 'letter',
                match: `${letter}-lower`
            });
            
            memoryPairs.push({
                id: `${letter}-lower`,
                content: letter.toLowerCase(),
                type: 'letter',
                match: `${letter}-upper`
            });
        });
        
        // Karten mischen
        const shuffledCards = [...memoryPairs].sort(() => Math.random() - 0.5);
        
        // Memory-Spielfeld erstellen
        const gameBoard = document.createElement('div');
        gameBoard.className = 'grid grid-cols-3 md:grid-cols-4 gap-4 mx-auto max-w-2xl mb-6';
        
        shuffledCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'relative h-24 perspective-500';
            cardElement.innerHTML = `
                <div class="card-inner w-full h-full transition-transform duration-500 transform-style-3d ${
                    this.selectedCards.includes(index) || this.matchedPairs.includes(card.id) ? 'rotate-y-180' : ''
                }">
                    <div class="card-face card-front absolute w-full h-full bg-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold cursor-pointer">
                        ?
                    </div>
                    <div class="card-face card-back absolute w-full h-full bg-white rounded-lg border-2 border-purple-500 flex items-center justify-center text-3xl ${
                        this.matchedPairs.includes(card.id) ? 'bg-green-100' : ''
                    }">
                        ${card.content}
                    </div>
                </div>
            `;
            cardElement.addEventListener('click', () => this.handleCardClick(index));
            gameBoard.appendChild(cardElement);
        });
        
        memoryDiv.appendChild(gameBoard);
        
        // Spielstatistik
        const stats = document.createElement('div');
        stats.className = 'mt-4 text-gray-700';
        stats.innerHTML = `<p>Versuche: ${this.attempts} | Gefundene Paare: ${this.matchedPairs.length / 2} von ${this.currentLetters.length}</p>`;
        memoryDiv.appendChild(stats);
        
        // Zurück-Button
        const backButton = document.createElement('button');
        backButton.className = 'game-button secondary mt-4 mr-2';
        backButton.textContent = 'Zurück zur Einführung';
        backButton.addEventListener('click', () => {
            this.currentStep = 'introduction';
            this.render();
        });
        memoryDiv.appendChild(backButton);
        
        container.appendChild(memoryDiv);
    },
    
    /**
     * Rendert den Abschlussbildschirm nach erfolgreichem Spiel
     * @param {HTMLElement} container - Der Container, in dem das Spiel gerendert wird
     */
    renderCompletion: function(container) {
        const completionDiv = document.createElement('div');
        completionDiv.className = 'text-center p-6 game-module';
        
        completionDiv.innerHTML = `
            <h2 class="text-2xl font-bold text-purple-600 mb-4">Geschafft!</h2>
            <div class="text-6xl mb-6">🎉</div>
            <p class="mb-4 text-lg">Du hast alle Buchstabenpaare gefunden!</p>
            <p class="mb-6">Du hast <span class="font-bold">${this.attempts}</span> Versuche gebraucht.</p>
            <div class="flex flex-wrap justify-center gap-4 mb-6">
                ${this.currentLetters.map(letter => `
                    <div class="character-card p-3">
                        <div class="text-2xl font-bold">${letter} ${letter.toLowerCase()}</div>
                    </div>
                `).join('')}
            </div>
            <button id="finish-btn" class="game-button">Spiel beenden</button>
        `;
        
        container.appendChild(completionDiv);
        
        document.getElementById('finish-btn').addEventListener('click', () => {
            this.onGameEnd(true); // Spiel erfolgreich beenden
        });
    },
    
    /**
     * Behandelt das Anklicken einer Karte im Memory-Spiel
     * @param {number} index - Der Index der angeklickten Karte
     */
    handleCardClick: function(index) {
        // Wenn die Karte bereits aufgedeckt oder gematcht ist, nichts tun
        if (this.selectedCards.includes(index) || this.matchedPairs.some(id => id === shuffledCards[index].id)) {
            return;
        }
        
        // Wenn bereits zwei Karten ausgewählt sind, nichts tun
        if (this.selectedCards.length === 2) {
            return;
        }
        
        // Karte aufdecken
        this.selectedCards.push(index);
        this.render();
        
        // Wenn zwei Karten ausgewählt sind, prüfen, ob sie übereinstimmen
        if (this.selectedCards.length === 2) {
            this.attempts++;
            const card1 = shuffledCards[this.selectedCards[0]];
            const card2 = shuffledCards[this.selectedCards[1]];
            
            if (card1.match === card2.id) {
                // Übereinstimmung gefunden
                this.matchedPairs.push(card1.id, card2.id);
                
                // Feedback geben
                AudioManager.playSound('success');
                UIManager.showFeedback('Super! Du hast ein Paar gefunden!', 'success');
                
                // Ausgewählte Karten zurücksetzen
                setTimeout(() => {
                    this.selectedCards = [];
                    
                    // Prüfen, ob alle Paare gefunden wurden
                    if (this.matchedPairs.length === shuffledCards.length) {
                        this.currentStep = 'completed';
                    }
                    
                    this.render();
                }, 1000);
            } else {
                // Keine Übereinstimmung
                setTimeout(() => {
                    this.selectedCards = [];
                    this.render();
                }, 1200);
            }
        }
    },
    
    /**
     * Bereinigt das Modul nach Spielende
     */
    cleanup: function() {
        // Aufräumarbeiten, z.B. Event-Listener entfernen
    }
};