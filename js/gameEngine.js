    createMapPoints(overlay, correctDirection, onSuccess) {
        overlay.innerHTML = '';
        
        const directions = ['north', 'south', 'east', 'west'];
        const positions = {
            north: { top: '10%', left: '50%' },
            south: { bottom: '10%', left: '50%' },
            east: { top: '50%', right: '10%' },
            west: { top: '50%', left: '10%' }
        };

        directions.forEach(direction => {
            const point = document.createElement('div');
            point.className = 'map-point';
            point.dataset.direction = direction;
            
            Object.assign(point.style, {
                position: 'absolute',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: direction === correctDirection ? '#27ae60' : '#e74c3c',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.3s ease',
                ...positions[direction]
            });

            const arrows = { north: '↑', south: '↓', east: '→', west: '←' };
            point.textContent = arrows[direction];

            point.addEventListener('click', () => {
                if (direction === correctDirection) {
                    point.style.backgroundColor = '#2ecc71';
                    point.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    setTimeout(onSuccess, 500);
                } else {
                    point.style.backgroundColor = '#c0392b';
                    point.style.animation = 'shake 0.5s ease-in-out';
                    this.audioManager?.playSound('error');
                }
            });

            point.addEventListener('mouseenter', () => {
                point.style.transform = 'translate(-50%, -50%) scale(1.1)';
            });

            point.addEventListener('mouseleave', () => {
                if (!point.classList.contains('clicked')) {
                    point.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            });

            overlay.appendChild(point);
        });
    }

    showTreasureFound() {
        const gameArea = document.getElementById('gameArea');
        gameArea.innerHTML = `
            <div class="treasure-found">
                <div class="treasure-animation">
                    <div class="treasure-chest">💰</div>
                    <div class="sparkles">✨✨✨</div>
                </div>
                <h2>Schatz gefunden! 🎉</h2>
                <p>Du hast alle Hinweise richtig gelesen!</p>
                <div class="treasure-reward">
                    <span class="points">+50 Punkte</span>
                    <span class="star">⭐ Neuer Stern!</span>
                </div>
            </div>
        `;

        this.addScore(50);
        this.audioManager?.playSound('applause');
        setTimeout(() => this.completeGame(), 3000);
    }

    // === WORTPAARE ===
    async initWordPairs(container) {
        const config = this.gameData.gameData;
        const pairType = config.pairTypes[Math.floor(Math.random() * config.pairTypes.length)];
        const pairs = config.pairs[pairType];
        
        container.innerHTML = `
            <div class="word-pairs-game">
                <div class="pairs-instructions">
                    <h3>Wortpaare finden</h3>
                    <p>Verbinde die Wörter, die zusammengehören!</p>
                    <div class="pair-type">Typ: ${this.getPairTypeLabel(pairType)}</div>
                </div>
                <div class="pairs-container">
                    <div class="left-words" id="leftWords"></div>
                    <div class="right-words" id="rightWords"></div>
                </div>
                <div class="pairs-progress">
                    <span>Gefunden: <span id="pairsFound">0</span>/${pairs.length}</span>
                </div>
            </div>
        `;

        this.initWordPairsLogic(pairs, pairType);
    }

    getPairTypeLabel(type) {
        const labels = {
            rhymes: "Reimwörter",
            opposites: "Gegensätze",
            categories: "Gleiche Kategorie"
        };
        return labels[type] || type;
    }

    initWordPairsLogic(pairs, pairType) {
        const leftWords = pairs.map(pair => pair[0]);
        const rightWords = pairs.map(pair => pair[1]);
        
        // Wörter mischen
        this.shuffleArray(leftWords);
        this.shuffleArray(rightWords);

        const leftContainer = document.getElementById('leftWords');
        const rightContainer = document.getElementById('rightWords');

        // Linke Wörter erstellen
        leftWords.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item left-word';
            wordElement.textContent = word;
            wordElement.dataset.word = word;
            wordElement.dataset.index = index;
            leftContainer.appendChild(wordElement);
        });

        // Rechte Wörter erstellen
        rightWords.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item right-word';
            wordElement.textContent = word;
            wordElement.dataset.word = word;
            wordElement.dataset.index = index;
            rightContainer.appendChild(wordElement);
        });

        this.setupWordPairsInteraction(pairs);
    }

    setupWordPairsInteraction(pairs) {
        let selectedLeft = null;
        let selectedRight = null;
        let foundPairs = 0;

        const leftWords = document.querySelectorAll('.left-word');
        const rightWords = document.querySelectorAll('.right-word');

        leftWords.forEach(word => {
            word.addEventListener('click', () => {
                if (word.classList.contains('matched')) return;
                
                // Andere linke Wörter deselektieren
                leftWords.forEach(w => w.classList.remove('selected'));
                
                selectedLeft = word;
                word.classList.add('selected');
                
                this.checkWordPairMatch(pairs, selectedLeft, selectedRight, () => {
                    foundPairs++;
                    document.getElementById('pairsFound').textContent = foundPairs;
                    
                    if (foundPairs === pairs.length) {
                        setTimeout(() => this.completeGame(), 1000);
                    }
                    
                    selectedLeft = null;
                    selectedRight = null;
                });
            });
        });

        rightWords.forEach(word => {
            word.addEventListener('click', () => {
                if (word.classList.contains('matched')) return;
                
                // Andere rechte Wörter deselektieren
                rightWords.forEach(w => w.classList.remove('selected'));
                
                selectedRight = word;
                word.classList.add('selected');
                
                this.checkWordPairMatch(pairs, selectedLeft, selectedRight, () => {
                    foundPairs++;
                    document.getElementById('pairsFound').textContent = foundPairs;
                    
                    if (foundPairs === pairs.length) {
                        setTimeout(() => this.completeGame(), 1000);
                    }
                    
                    selectedLeft = null;
                    selectedRight = null;
                });
            });
        });
    }

    checkWordPairMatch(pairs, leftWord, rightWord, onMatch) {
        if (!leftWord || !rightWord) return;

        const leftText = leftWord.dataset.word;
        const rightText = rightWord.dataset.word;

        // Prüfe ob die Wörter ein Paar bilden
        const isMatch = pairs.some(pair => 
            (pair[0] === leftText && pair[1] === rightText) ||
            (pair[1] === leftText && pair[0] === rightText)
        );

        if (isMatch) {
            // Match gefunden!
            leftWord.classList.add('matched');
            rightWord.classList.add('matched');
            leftWord.classList.remove('selected');
            rightWord.classList.remove('selected');
            
            // Verbindungslinie zeichnen
            this.drawConnectionLine(leftWord, rightWord);
            
            this.audioManager?.playSound('success');
            this.addScore(15);
            onMatch();
        } else {
            // Kein Match
            leftWord.classList.add('wrong');
            rightWord.classList.add('wrong');
            
            setTimeout(() => {
                leftWord.classList.remove('wrong', 'selected');
                rightWord.classList.remove('wrong', 'selected');
            }, 1000);
            
            this.audioManager?.playSound('error');
        }
    }

    drawConnectionLine(leftElement, rightElement) {
        const leftRect = leftElement.getBoundingClientRect();
        const rightRect = rightElement.getBoundingClientRect();
        const container = leftElement.closest('.word-pairs-game');
        
        const line = document.createElement('div');
        line.className = 'connection-line';
        
        const containerRect = container.getBoundingClientRect();
        const startX = leftRect.right - containerRect.left;
        const startY = leftRect.top + leftRect.height / 2 - containerRect.top;
        const endX = rightRect.left - containerRect.left;
        const endY = rightRect.top + rightRect.height / 2 - containerRect.top;
        
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        
        Object.assign(line.style, {
            position: 'absolute',
            left: `${startX}px`,
            top: `${startY}px`,
            width: `${length}px`,
            height: '3px',
            backgroundColor: '#27ae60',
            transformOrigin: '0 50%',
            transform: `rotate(${angle}deg)`,
            zIndex: '1'
        });
        
        container.appendChild(line);
    }

    // === LESE-WÜRFEL ===
    async initReadingDice(container) {
        const config = this.gameData.gameData;
        let correctAnswers = 0;
        let totalQuestions = 10;
        
        container.innerHTML = `
            <div class="dice-game">
                <div class="dice-instructions">
                    <h3>Lese-Würfel</h3>
                    <p>Würfle ein Wort und klicke auf das passende Bild!</p>
                </div>
                <div class="dice-container">
                    <div class="dice" id="gameDice">🎲</div>
                    <button id="rollDiceBtn" class="roll-btn">Würfeln!</button>
                    <div class="current-word" id="diceWord">Klicke auf Würfeln!</div>
                </div>
                <div class="image-grid" id="diceImages"></div>
                <div class="dice-score">
                    Richtig: <span id="diceScore">0</span>/${totalQuestions}
                </div>
            </div>
        `;

        this.initDiceLogic(config, totalQuestions);
    }

    initDiceLogic(config, totalQuestions) {
        let currentWord = null;
        let questionsAnswered = 0;
        
        const dice = document.getElementById('gameDice');
        const rollBtn = document.getElementById('rollDiceBtn');
        const wordDisplay = document.getElementById('diceWord');
        const imagesContainer = document.getElementById('diceImages');
        const scoreDisplay = document.getElementById('diceScore');

        const rollDice = () => {
            // Würfel-Animation
            dice.style.animation = 'spin 1s ease-in-out';
            rollBtn.disabled = true;
            
            setTimeout(() => {
                currentWord = config.diceWords[Math.floor(Math.random() * config.diceWords.length)];
                wordDisplay.textContent = currentWord;
                dice.style.animation = '';
                
                this.createDiceImages(imagesContainer, currentWord, config.images, (isCorrect) => {
                    questionsAnswered++;
                    if (isCorrect) {
                        this.addScore(10);
                        scoreDisplay.textContent = questionsAnswered;
                    }
                    
                    if (questionsAnswered >= totalQuestions) {
                        setTimeout(() => this.completeGame(), 1500);
                    } else {
                        setTimeout(() => {
                            rollBtn.disabled = false;
                            wordDisplay.textContent = 'Klicke auf Würfeln!';
                            imagesContainer.innerHTML = '';
                        }, 2000);
                    }
                });
            }, 1000);
        };

        rollBtn.addEventListener('click', rollDice);
    }

    createDiceImages(container, correctWord, imageMap, onAnswer) {
        const correctImage = imageMap[correctWord];
        const allImages = Object.values(imageMap);
        
        // 3 zufällige Bilder auswählen (eines davon korrekt)
        const wrongImages = allImages.filter(img => img !== correctImage);
        this.shuffleArray(wrongImages);
        const selectedImages = [correctImage, ...wrongImages.slice(0, 2)];
        this.shuffleArray(selectedImages);

        container.innerHTML = selectedImages.map((image, index) => `
            <div class="dice-image" data-image="${image}">
                <img src="assets/images/words/${image}" alt="Option ${index + 1}"
                     onerror="this.src='assets/images/words/placeholder.jpg'">
            </div>
        `).join('');

        const imageElements = container.querySelectorAll('.dice-image');
        imageElements.forEach(imageEl => {
            imageEl.addEventListener('click', () => {
                const clickedImage = imageEl.dataset.image;
                const isCorrect = clickedImage === correctImage;
                
                if (isCorrect) {
                    imageEl.classList.add('correct');
                    this.audioManager?.playSound('success');
                } else {
                    imageEl.classList.add('wrong');
                    // Zeige auch die richtige Antwort
                    imageElements.forEach(el => {
                        if (el.dataset.image === correctImage) {
                            el.classList.add('correct');
                        }
                    });
                    this.audioManager?.playSound('error');
                }
                
                // Alle Bilder deaktivieren
                imageElements.forEach(el => el.style.pointerEvents = 'none');
                
                onAnswer(isCorrect);
            });
        });
    }

    // === BONUSSPIELE ===
    async initBalloonShooter(container) {
        container.innerHTML = `
            <div class="balloon-shooter">
                <div class="shooter-instructions">
                    <h3>Ballon-Schießen 🎈</h3>
                    <p>Höre dir den Buchstaben an und schieße auf den richtigen Ballon!</p>
                </div>
                <div class="game-sky" id="gameSky">
                    <div class="crosshair" id="crosshair">+</div>
                </div>
                <div class="shooter-controls">
                    <button id="playLetterBtn" class="play-letter-btn">🔊 Buchstabe anhören</button>
                    <div class="target-letter" id="targetLetter">?</div>
                    <div class="shooter-stats">
                        <span>Treffer: <span id="shooterScore">0</span></span>
                        <span>Zeit: <span id="shooterTime">60</span>s</span>
                    </div>
                </div>
            </div>
        `;

        this.initBalloonShooterLogic();
    }

    initBalloonShooterLogic() {
        const sky = document.getElementById('gameSky');
        const crosshair = document.getElementById('crosshair');
        const playBtn = document.getElementById('playLetterBtn');
        const targetDisplay = document.getElementById('targetLetter');
        const scoreDisplay = document.getElementById('shooterScore');
        const timeDisplay = document.getElementById('shooterTime');
        
        let currentLetter = null;
        let score = 0;
        let timeLeft = 60;
        let balloons = [];
        let gameRunning = true;

        // Maus-Verfolgung für Fadenkreuz
        sky.addEventListener('mousemove', (e) => {
            const rect = sky.getBoundingClientRect();
            crosshair.style.left = `${e.clientX - rect.left}px`;
            crosshair.style.top = `${e.clientY - rect.top}px`;
        });

        // Neuen Ziel-Buchstaben wählen
        const selectNewLetter = () => {
            const letters = ['A', 'E', 'I', 'O', 'U', 'M', 'L', 'S', 'R', 'N'];
            currentLetter = letters[Math.floor(Math.random() * letters.length)];
            targetDisplay.textContent = currentLetter;
        };

        // Ballon erstellen
        const createBalloon = () => {
            if (!gameRunning) return;

            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            
            const letters = ['A', 'E', 'I', 'O', 'U', 'M', 'L', 'S', 'R', 'N'];
            const letter = letters[Math.floor(Math.random() * letters.length)];
            const isTarget = letter === currentLetter;
            
            balloon.textContent = letter;
            balloon.dataset.letter = letter;
            balloon.dataset.isTarget = isTarget;
            
            // Zufällige Position und Farbe
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.left = `${Math.random() * (sky.offsetWidth - 60)}px`;
            balloon.style.bottom = '0px';
            
            // Ballon-Animation
            const duration = 3000 + Math.random() * 2000;
            balloon.style.animation = `balloon-rise ${duration}ms linear`;
            
            // Klick-Event
            balloon.addEventListener('click', () => {
                this.shootBalloon(balloon, isTarget, () => {
                    score += isTarget ? 10 : -5;
                    scoreDisplay.textContent = Math.max(0, score);
                    this.updateScore(Math.max(0, score));
                    
                    if (isTarget) {
                        selectNewLetter();
                    }
                });
            });
            
            sky.appendChild(balloon);
            balloons.push(balloon);
            
            // Ballon nach Animation entfernen
            setTimeout(() => {
                if (balloon.parentNode) {
                    balloon.parentNode.removeChild(balloon);
                    balloons = balloons.filter(b => b !== balloon);
                }
            }, duration);
        };

        // Timer
        const timer = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                gameRunning = false;
                clearInterval(timer);
                clearInterval(balloonInterval);
                this.completeGame();
            }
        }, 1000);

        // Ballon-Spawn
        const balloonInterval = setInterval(createBalloon, 1500);

        // Event Listeners
        playBtn.addEventListener('click', () => {
            if (currentLetter) {
                this.audioManager?.playLetterSound(currentLetter);
            }
        });

        // Spiel starten
        selectNewLetter();
        createBalloon();
    }

    shootBalloon(balloon, isTarget, callback) {
        balloon.style.animation = 'balloon-pop 0.3s ease-out';
        balloon.style.pointerEvents = 'none';
        
        if (isTarget) {
            balloon.style.backgroundColor = '#27ae60';
            this.audioManager?.playSound('success');
        } else {
            balloon.style.backgroundColor = '#e74c3c';
            this.audioManager?.playSound('error');
        }
        
        setTimeout(() => {
            if (balloon.parentNode) {
                balloon.parentNode.removeChild(balloon);
            }
            callback();
        }, 300);
    }

    // === VOKAL-SAMMLER ===
    async initVowelCollector(container) {
        container.innerHTML = `
            <div class="vowel-collector">
                <div class="collector-instructions">
                    <h3>Vokal-Sammler 🎯</h3>
                    <p>Sammle nur die Vokale und meide die Konsonanten!</p>
                </div>
                <div class="collection-area" id="collectionArea">
                    <div class="collector" id="collector">🧺</div>
                </div>
                <div class="collector-stats">
                    <span>Vokale: <span id="vowelCount">0</span></span>
                    <span>Leben: <span id="livesCount">3</span></span>
                    <span>Zeit: <span id="collectorTime">90</span>s</span>
                </div>
            </div>
        `;

        this.initVowelCollectorLogic();
    }

    initVowelCollectorLogic() {
        const area = document.getElementById('collectionArea');
        const collector = document.getElementById('collector');
        const vowelDisplay = document.getElementById('vowelCount');
        const livesDisplay = document.getElementById('livesCount');
        const timeDisplay = document.getElementById('collectorTime');
        
        let vowelCount = 0;
        let lives = 3;
        let timeLeft = 90;
        let gameRunning = true;
        let items = [];

        const vowels = ['A', 'E', 'I', 'O', 'U', 'Ä', 'Ö', 'Ü'];
        const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

        // Sammler-Bewegung
        area.addEventListener('mousemove', (e) => {
            const rect = area.getBoundingClientRect();
            const x = e.clientX - rect.left - 25; // 25px = halbe Breite des Sammlers
            collector.style.left = `${Math.max(0, Math.min(x, area.offsetWidth - 50))}px`;
        });

        // Touch-Support für Mobile
        area.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = area.getBoundingClientRect();
            const x = touch.clientX - rect.left - 25;
            collector.style.left = `${Math.max(0, Math.min(x, area.offsetWidth - 50))}px`;
        });

        // Item erstellen
        const createItem = () => {
            if (!gameRunning) return;

            const item = document.createElement('div');
            item.className = 'falling-letter';
            
            const isVowel = Math.random() < 0.6; // 60% Chance für Vokal
            const letter = isVowel ? 
                vowels[Math.floor(Math.random() * vowels.length)] :
                consonants[Math.floor(Math.random() * consonants.length)];
            
            item.textContent = letter;
            item.dataset.letter = letter;
            item.dataset.isVowel = isVowel;
            
            // Styling
            item.style.backgroundColor = isVowel ? '#27ae60' : '#e74c3c';
            item.style.color = 'white';
            item.style.left = `${Math.random() * (area.offsetWidth - 40)}px`;
            item.style.top = '0px';
            
            area.appendChild(item);
            items.push(item);
            
            // Fall-Animation
            this.animateFallingItem(item, () => {
                this.checkItemCollection(item, () => {
                    if (item.dataset.isVowel === 'true') {
                        vowelCount++;
                        vowelDisplay.textContent = vowelCount;
                        this.addScore(5);
                        this.audioManager?.playSound('success');
                    } else {
                        lives--;
                        livesDisplay.textContent = lives;
                        this.audioManager?.playSound('error');
                        
                        if (lives <= 0) {
                            gameRunning = false;
                            this.showGameOver();
                        }
                    }
                });
            });
        };

        // Timer
        const timer = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                gameRunning = false;
                clearInterval(timer);
                clearInterval(itemInterval);
                this.completeGame();
            }
        }, 1000);

        // Item-Spawn
        const itemInterval = setInterval(createItem, 1000);

        // Spiel starten
        createItem();
    }

    animateFallingItem(item, onComplete) {
        const area = item.parentNode;
        let position = 0;
        const speed = 2 + Math.random() * 3;
        
        const fall = () => {
            position += speed;
            item.style.top = `${position}px`;
            
            if (position > area.offsetHeight) {
                if (item.parentNode) {
                    item.parentNode.removeChild(item);
                }
                return;
            }
            
            requestAnimationFrame(fall);
        };
        
        fall();
    }

    checkItemCollection(item, onCollect) {
        const itemRect = item.getBoundingClientRect();
        const collectorRect = document.getElementById('collector').getBoundingClientRect();
        
        // Einfache Kollisionserkennung
        const collision = !(itemRect.right < collectorRect.left || 
                           itemRect.left > collectorRect.right || 
                           itemRect.bottom < collectorRect.top || 
                           itemRect.top > collectorRect.bottom);
        
        if (collision) {
            // Item gesammelt
            item.style.animation = 'item-collect 0.3s ease-out';
            setTimeout(() => {
                if (item.parentNode) {
                    item.parentNode.removeChild(item);
                }
                onCollect();
            }, 300);
        }
    }

    // === HELPER METHODEN ===
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    addScore(points) {
        this.score += points;
        this.updateScore();
    }

    updateScore(newScore = null) {
        if (newScore !== null) {
            this.score = newScore;
        }
        
        const scoreElement = document.getElementById('gameScore');
        if (scoreElement) {
            scoreElement.textContent = `Punkte: ${this.score}`;
        }
    }

    updateTimer() {
        const timerElement = document.getElementById('gameTimer');
        if (timerElement) {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            timerElement.textContent = `Zeit: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    startTimer(duration) {
        this.timeLeft = duration;
        this.updateTimer();
        
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    timeUp() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.showTimeUpMessage();
    }

    showTimeUpMessage() {
        const gameArea = document.getElementById('gameArea');
        const overlay = document.createElement('div');
        overlay.className = 'time-up-overlay';
        overlay.innerHTML = `
            <div class="time-up-message">
                <h2>Zeit ist um! ⏰</h2>
                <p>Du hast ${this.score} Punkte erreicht!</p>
                <button class="continue-btn" onclick="this.parentNode.parentNode.remove()">Weiter</button>
            </div>
        `;
        gameArea.appendChild(overlay);
        
        setTimeout(() => {
            this.completeGame();
        }, 3000);
    }

    showHint() {
        const hints = {
            'alphabetIntroduction': 'Versuche dir zu merken, wo die gleichen Buchstaben liegen!',
            'letterBingo': 'Höre dir den Buchstaben mehrmals an, wenn du unsicher bist!',
            'syllableClap': 'Sprich das Wort laut aus und klatsche bei jedem Vokal!',
            'treasureHunt': 'Lies die Hinweise langsam und sorgfältig!',
            'blitzwoerter': 'Konzentriere dich auf das Wort, bevor die Bilder erscheinen!',
            'wortpaare': 'Überlege, was die Wörter gemeinsam haben!',
            'leseWuerfel': 'Sprich das Wort laut aus und überlege, was es bedeutet!',
            'balloonShooter': 'Höre dir den Buchstaben an und schaue genau hin!',
            'vokalSammler': 'Vokale sind: A, E, I, O, U, Ä, Ö, Ü'
        };
        
        const hint = hints[this.currentGame] || 'Du schaffst das! Gib nicht auf!';
        
        this.showNotification(hint, 'info', 3000);
    }

    showNotification(message, type = 'info', duration = 2000) {
        const notification = document.createElement('div');
        notification.className = `game-notification ${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            zIndex: '1000',
            maxWidth: '300px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        if (type === 'success') notification.style.backgroundColor = '#27ae60';
        else if (type === 'error') notification.style.backgroundColor = '#e74c3c';
        else if (type === 'info') notification.style.backgroundColor = '#3498db';
        
        document.body.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Slide out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    restartGame() {
        // Aktuelles Spiel neu starten
        this.score = 0;
        this.timeLeft = 0;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.initSpecificGame(this.currentGame);
    }

    completeGame() {
        // Spiel beenden und Belohnung zeigen
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        // Statistiken speichern
        this.saveManager?.addGameScore(this.currentGame, this.score);
        
        // Erfolgs-Bildschirm
        this.showGameComplete();
    }

    showGameComplete() {
        const gameArea = document.getElementById('gameArea');
        gameArea.innerHTML = `
            <div class="game-complete">
                <div class="completion-animation">
                    <div class="trophy">🏆</div>
                    <div class="confetti">🎉</div>
                </div>
                <h2>Spiel abgeschlossen!</h2>
                <div class="final-score">
                    <span class="score-label">Deine Punkte:</span>
                    <span class="score-value">${this.score}</span>
                </div>
                <div class="completion-message">
                    ${this.getCompletionMessage()}
                </div>
                <div class="completion-buttons">
                    <button class="play-again-btn" onclick="window.game.gameEngine.restartGame()">
                        🔄 Nochmal spielen
                    </button>
                    <button class="back-to-games-btn" onclick="window.game.showGamesScreen()">
                        🎮 Andere Spiele
                    </button>
                    <button class="back-to-menu-btn" onclick="window.game.showMainMenu()">
                        🏠 Hauptmenü
                    </button>
                </div>
            </div>
        `;
        
        this.audioManager?.playSound('applause');
        
        // Konfetti-Animation (falls verfügbar)
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    getCompletionMessage() {
        if (this.score >= 100) {
            return "Fantastisch! Du bist ein echter Lese-Champion! ⭐⭐⭐";
        } else if (this.score >= 60) {
            return "Super gemacht! Du lernst schnell! ⭐⭐";
        } else if (this.score >= 30) {
            return "Gut gemacht! Übung macht den Meister! ⭐";
        } else {
            return "Das war ein guter Anfang! Versuch es gerne nochmal! 😊";
        }
    }

    showGameOver() {
        const gameArea = document.getElementById('gameArea');
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        overlay.innerHTML = `
            <div class="game-over-message">
                <h2>Spiel beendet! 😔</h2>
                <p>Keine Sorge, beim nächsten Mal klappt es bestimmt besser!</p>
                <p>Deine Punkte: ${this.score}</p>
                <div class="game-over-buttons">
                    <button class="retry-btn" onclick="window.game.gameEngine.restartGame(); this.parentNode.parentNode.parentNode.remove()">
                        🔄 Nochmal versuchen
                    </button>
                    <button class="quit-btn" onclick="window.game.showGamesScreen(); this.parentNode.parentNode.parentNode.remove()">
                        📋 Andere Spiele
                    </button>
                </div>
            </div>
        `;
        gameArea.appendChild(overlay);
    }

    endGame() {
        // Spiel beenden und aufräumen
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        // Zurück zu den Spielen
        window.game?.showGamesScreen();
        
        this.currentGame = null;
        this.gameData = null;
        this.score = 0;
        this.timeLeft = 0;
    }
}

// CSS-Animationen für Spiele (wird dynamisch hinzugefügt)
const gameStyles = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes balloon-rise {
    from { bottom: 0px; opacity: 1; }
    to { bottom: 100%; opacity: 0.8; }
}

@keyframes balloon-pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(0); opacity: 0; }
}

@keyframes item-collect {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(0); opacity: 0; }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

@keyframes starShine {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); filter: brightness(1.5); }
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
}

.memory-card {
    width: 100px;
    height: 100px;
    perspective: 1000px;
    cursor: pointer;
}

.memory-card.flipped .card-front {
    transform: rotateY(0deg);
}

.memory-card.flipped .card-back {
    transform: rotateY(180deg);
}

.memory-card.matched {
    opacity: 0.6;
    pointer-events: none;
}

.card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    transition: transform 0.6s;
}

.card-front {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: rotateY(180deg);
}

.card-back {
    background: #34495e;
    color: white;
    transform: rotateY(0deg);
}

.connection-line {
    animation: draw-line 0.5s ease-out;
}

@keyframes draw-line {
    from { width: 0; }
    to { width: 100%; }
}

.balloon {
    position: absolute;
    width: 50px;
    height: 70px;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 18px;
    cursor: crosshair;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.balloon::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 20px;
    background: #333;
}

.crosshair {
    position: absolute;
    font-size: 30px;
    color: #e74c3c;
    pointer-events: none;
    z-index: 100;
    transform: translate(-50%, -50%);
}

.falling-letter {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.game-complete, .game-over-overlay, .time-up-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 2rem;
}

.trophy {
    font-size: 4rem;
    animation: bounce 2s infinite;
}

.final-score {
    margin: 1rem 0;
    font-size: 1.5rem;
}

.score-value {
    color: #f39c12;
    font-weight: bold;
    font-size: 2rem;
}

.completion-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    flex-wrap: wrap;
    justify-content: center;
}

.completion-buttons button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.play-again-btn {
    background: #3498db;
    color: white;
}

.back-to-games-btn {
    background: #27ae60;
    color: white;
}

.back-to-menu-btn {
    background: #e74c3c;
    color: white;
}

.completion-buttons button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
`;

// Styles zur Seite hinzufügen
if (!document.getElementById('gameStyles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'gameStyles';
    styleSheet.textContent = gameStyles;
    document.head.appendChild(styleSheet);
}