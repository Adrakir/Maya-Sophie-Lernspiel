/**
 * GameManager.js
 * 
 * Zentrales Modul für die Spielsteuerung und -verwaltung
 * Koordiniert alle Aspekte des Spiels und den Spielstand
 */
const GameManager = {
    /**
     * Spielstatus mit allen relevanten Daten
     */
    gameState: {
        currentDay: 1,
        currentPlayer: null, // 'maja' oder 'sophie'
        difficultyLevel: null, // 'buchstabenentdecker', 'leseanfaenger', 'lesehase'
        majaProgress: {
            learnedLetters: [],
            collectedPages: 0,
            totalPoints: 0
        },
        sophieProgress: {
            helpedMajaTimes: 0,
            totalPoints: 0
        },
        completedGames: {}, // Tag: [abgeschlossene Spiele]
        storyProgress: {
            readStories: [], // Gelesene Tagesgeschichten
            interactiveStoryChoices: {} // Entscheidungen in interaktiven Geschichten
        },
        treasureHuntProgress: {}, // Fortschritt bei Schatzsuchen
        settings: {
            soundEnabled: true,
            textToSpeechEnabled: true,
            animationsEnabled: true
        }
    },
    
    /**
     * Initialisiert das Spiel
     */
    init: function() {
        console.log("Initialisiere Spiel...");
        
        // Versuche, einen gespeicherten Spielstand zu laden
        const savedState = SaveLoadManager.loadGameState();
        if (savedState) {
            this.gameState = savedState;
            console.log("Spielstand geladen: Tag", this.gameState.currentDay);
        }
        
        // Audio-Manager initialisieren
        AudioManager.init(this.gameState.settings.soundEnabled);
        
        // UI initialisieren und Startbildschirm anzeigen
        UIManager.init();
        UIManager.renderStartScreen();
        
        // Event-Listener einrichten
        this.setupEventListeners();
        
        console.log("Spiel initialisiert.");
    },
    
    /**
     * Richtet globale Event-Listener ein
     */
    setupEventListeners: function() {
        // Zum Elternbereich wechseln durch dreimaliges schnelles Klicken auf das Zahnrad-Symbol
        let parentAreaClickCount = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'settings-icon') {
                const currentTime = new Date().getTime();
                
                if (currentTime - lastClickTime < 500) {
                    parentAreaClickCount++;
                    
                    if (parentAreaClickCount >= 3) {
                        parentAreaClickCount = 0;
                        GameManager.showParentAreaLogin();
                    }
                } else {
                    parentAreaClickCount = 1;
                }
                
                lastClickTime = currentTime;
            }
        });
        
        // Globaler Tastatur-Event-Listener
        document.addEventListener('keydown', function(e) {
            // ESC-Taste drücken schließt Modals
            if (e.key === 'Escape') {
                UIManager.closeModal();
            }
        });
    },
    
    /**
     * Startet ein neues Spiel
     * @param {string} player - Gewählter Spieler ('maja' oder 'sophie')
     * @param {string} difficulty - Gewählter Schwierigkeitsgrad
     */
    startNewGame: function(player, difficulty) {
        console.log(`Starte neues Spiel als ${player} mit Schwierigkeitsgrad ${difficulty}`);
        
        // Neuen Spielstand initialisieren
        this.gameState = {
            currentDay: 1,
            currentPlayer: player,
            difficultyLevel: difficulty,
            majaProgress: {
                learnedLetters: [],
                collectedPages: 0,
                totalPoints: 0
            },
            sophieProgress: {
                helpedMajaTimes: 0,
                totalPoints: 0
            },
            completedGames: {},
            storyProgress: {
                readStories: [],
                interactiveStoryChoices: {}
            },
            treasureHuntProgress: {},
            settings: {
                soundEnabled: true,
                textToSpeechEnabled: true,
                animationsEnabled: true
            }
        };
        
        // Spielstand speichern
        SaveLoadManager.saveGameState(this.gameState);
        
        // Willkommensgeschichte anzeigen
        this.showIntroStory();
    },
    
    // Weitere Funktionen zur Spielsteuerung...
    // Die vollständige Implementierung enthält alle Spielmechaniken
};