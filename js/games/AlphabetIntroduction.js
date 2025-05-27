// Alphabet-Einführungs-Modul für Maya & Sophie Lernspiel

const AlphabetIntroduction = {
    // Modul-Konfiguration
    letters: [
        { letter: 'A', word: 'Apfel', image: 'assets/images/words/apfel.png', sound: 'assets/sounds/letters/a.mp3' },
        { letter: 'B', word: 'Ball', image: 'assets/images/words/ball.png', sound: 'assets/sounds/letters/b.mp3' },
        { letter: 'C', word: 'Computer', image: 'assets/images/words/computer.png', sound: 'assets/sounds/letters/c.mp3' },
        // Weitere Buchstaben...
    ],
    currentPage: 0,
    lettersPerPage: 4,
    
    // Modul initialisieren
    init: function() {
        this.loadAssets().then(() => {
            this.render();
        });
    },
    
    // Assets laden
    loadAssets: async function() {
        const imageAssets = {};
        const soundAssets = {};
        
        // Bilder und Sounds für jeden Buchstaben sammeln
        this.letters.forEach(item => {
            const letterKey = `letter_${item.letter.toLowerCase()}`;
            const wordKey = `word_${item.word.toLowerCase()}`;
            
            imageAssets[wordKey] = item.image;
            soundAssets[letterKey] = item.sound;
        });
        
        // Assets laden
        await Promise.all([
            loader.loadImages(imageAssets),
            loader.loadSounds(soundAssets)
        ]);
    },
    
    // Modul rendern
    render: function() {
        // Berechnen, welche Buchstaben auf der aktuellen Seite angezeigt werden
        const startIndex = this.currentPage * this.lettersPerPage;
        const endIndex = Math.min(startIndex + this.lettersPerPage, this.letters.length);
        const currentLetters = this.letters.slice(startIndex, endIndex);
        
        // HTML für die aktuelle Seite erstellen
        let html = `
            <div class="alphabet-container">
                <div class="alphabet-header">
                    <h2>Lerne das Alphabet</h2>
                    <p>Klicke auf die Buchstaben und Bilder, um die Laute zu hören!</p>
                </div>
                <div class="alphabet-grid">
        `;
        
        // Buchstaben hinzufügen
        currentLetters.forEach(item => {
            html += `
                <div class="alphabet-item">
                    <div class="letter" data-letter="${item.letter}">${item.letter}</div>
                    <div class="word-container">
                        <img src="${item.image}" alt="${item.word}" data-word="${item.word}">
                        <div class="word">${item.word}</div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="navigation">
                    <button id="prev-page" ${this.currentPage === 0 ? 'disabled' : ''}>Zurück</button>
                    <div class="page-indicator">Seite ${this.currentPage + 1} von ${Math.ceil(this.letters.length / this.lettersPerPage)}</div>
                    <button id="next-page" ${endIndex >= this.letters.length ? 'disabled' : ''}>Weiter</button>
                </div>
            </div>
        `;
        
        // HTML in die UI einfügen
        ui.setGameContent(html);
        
        // Event-Listener hinzufügen
        this.addEventListeners();
    },
    
    // Event-Listener hinzufügen
    addEventListeners: function() {
        // Buchstaben-Klick
        document.querySelectorAll('.letter').forEach(element => {
            element.addEventListener('click', (e) => {
                const letter = e.target.getAttribute('data-letter');
                this.playLetterSound(letter);
                e.target.classList.add('active');
                setTimeout(() => {
                    e.target.classList.remove('active');
                }, 500);
            });
        });
        
        // Bild-Klick
        document.querySelectorAll('.word-container img').forEach(element => {
            element.addEventListener('click', (e) => {
                const word = e.target.getAttribute('data-word');
                alert(`Das ist ein ${word}!`);
                e.target.classList.add('active');
                setTimeout(() => {
                    e.target.classList.remove('active');
                }, 500);
            });
        });
        
        // Navigation
        document.getElementById('prev-page')?.addEventListener('click', () => {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.render();
            }
        });
        
        document.getElementById('next-page')?.addEventListener('click', () => {
            if ((this.currentPage + 1) * this.lettersPerPage < this.letters.length) {
                this.currentPage++;
                this.render();
            }
        });
    },
    
    // Buchstaben-Sound abspielen
    playLetterSound: function(letter) {
        const soundKey = `letter_${letter.toLowerCase()}`;
        const sound = loader.sounds[soundKey];
        
        if (sound) {
            // Sound zurücksetzen und abspielen
            sound.currentTime = 0;
            sound.play();
        }
    }
};