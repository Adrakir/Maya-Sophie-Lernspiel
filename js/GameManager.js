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
    
    /**
     * Zeigt die Einführungsgeschichte an
     */
    showIntroStory: function() {
        const introStory = StoryManager.getIntroStory();
        UIManager.renderStory(introStory, () => {
            // Nach der Intro-Story zum ersten Tag
            this.goToDay(1);
        });
    },
    
    /**
     * Wechselt zu einem bestimmten Tag
     * @param {number} day - Der Tag, zu dem gewechselt werden soll
     */
    goToDay: function(day) {
        if (day < 1 || day > 35) {
            console.error("Ungültiger Tag:", day);
            return;
        }
        
        this.gameState.currentDay = day;
        SaveLoadManager.saveGameState(this.gameState);
        
        // Tagesgeschichte anzeigen
        const dayStory = StoryManager.getStoryForDay(day);
        if (dayStory) {
            UIManager.renderStory(dayStory, () => {
                // Nach der Geschichte zum Tages-Hub
                this.showDayHub();
            });
            
            // Markiere Geschichte als gelesen
            if (!this.gameState.storyProgress.readStories.includes(day)) {
                this.gameState.storyProgress.readStories.push(day);
                SaveLoadManager.saveGameState(this.gameState);
            }
        } else {
            console.error("Keine Geschichte für Tag", day, "gefunden");
            this.showDayHub();
        }
    },
    
    /**
     * Zeigt den Tages-Hub mit verfügbaren Spielen an
     */
    showDayHub: function() {
        // Verfügbare Spiele für den aktuellen Tag abrufen
        const availableGames = this.getGamesForCurrentDay();
        
        // Prüfen, ob alle Spiele für diesen Tag abgeschlossen sind
        const completedGamesForDay = this.gameState.completedGames[this.gameState.currentDay] || [];
        const allGamesCompleted = availableGames.length > 0 && 
                                 availableGames.every(game => completedGamesForDay.includes(game.id));
        
        // Hub-Screen rendern
        UIManager.renderDayHub(
            this.gameState.currentDay,
            availableGames,
            completedGamesForDay,
            allGamesCompleted,
            (game) => this.startGame(game),
            () => this.goToNextDay()
        );
    },
    
    /**
     * Ermittelt die verfügbaren Spiele für den aktuellen Tag
     * @returns {Array} Liste der verfügbaren Spiele
     */
    getGamesForCurrentDay: function() {
        const day = this.gameState.currentDay;
        const difficulty = this.gameState.difficultyLevel;
        
        // Hier Spiele basierend auf Tag und Schwierigkeitsgrad zurückgeben
        return ContentData.getGamesForDay(day, difficulty);
    },
    
    /**
     * Startet ein Spiel
     * @param {Object} game - Das zu startende Spiel
     */
    startGame: function(game) {
        console.log("Starte Spiel:", game.id);
        
        this.gameState.currentGame = game.id;
        SaveLoadManager.saveGameState(this.gameState);
        
        // Spiel-spezifische Daten laden
        const gameData = ContentData.getGameDataForDay(
            this.gameState.currentDay,
            game.id,
            this.gameState.difficultyLevel
        );
        
        // Prüfen, ob das entsprechende Spielmodul existiert
        const gameModule = this.getGameModule(game.id);
        if (!gameModule) {
            console.error("Spielmodul nicht gefunden:", game.id);
            UIManager.showErrorMessage("Dieses Spiel ist noch in Entwicklung. Bitte versuche es später noch einmal.");
            return;
        }
        
        // Spiel-Container vorbereiten und Spiel initialisieren
        UIManager.prepareGameContainer();
        
        gameModule.init(gameData, (success) => {
            this.onGameEnd(game.id, success);
        });
    },
    
    /**
     * Ermittelt das entsprechende Spielmodul anhand der ID
     * @param {string} gameId - ID des Spiels
     * @returns {Object} Das Spielmodul oder null, wenn nicht gefunden
     */
    getGameModule: function(gameId) {
        const gameModuleMap = {
            'alphabetIntroduction': Game_AlphabetIntroduction,
            'letterBingo': Game_LetterBingo,
            'syllableClap': Game_SyllableClap,
            'treasureHunt': Game_TreasureHunt,
            'interactiveStory': Game_InteractiveStory,
            'blitzwoerter': Game_Blitzwoerter,
            'wortpaare': Game_Wortpaare,
            'leseWuerfel': Game_LeseWuerfel,
            'wortkette': Game_Wortkette,
            'buecherwurm': Game_Buecherwurm,
            'wortgitter': Game_Wortgitter,
            'lueckentextMaus': Game_LueckentextMaus,
            'raetselGeschichte': Game_RaetselGeschichte,
            'pictureStory': Game_PictureStory
        };
        
        return gameModuleMap[gameId] || null;
    },
    
    /**
     * Wird aufgerufen, wenn ein Spiel beendet wird
     * @param {string} gameId - ID des beendeten Spiels
     * @param {boolean} success - Ob das Spiel erfolgreich abgeschlossen wurde
     */
    onGameEnd: function(gameId, success) {
        console.log(`Spiel ${gameId} beendet. Erfolgreich: ${success}`);
        
        // Aktuelles Spiel zurücksetzen
        this.gameState.currentGame = null;
        
        if (success) {
            // Punkte für erfolgreiches Spiel vergeben
            const points = 10; // Standard-Punktzahl
            
            if (this.gameState.currentPlayer === 'maja') {
                this.gameState.majaProgress.totalPoints += points;
                
                // Bei bestimmten Spielen neue Buchstaben lernen
                if (gameId === 'alphabetIntroduction') {
                    this.learnNewLetters();
                }
            } else {
                this.gameState.sophieProgress.totalPoints += points;
                this.gameState.sophieProgress.helpedMajaTimes += 1;
            }
            
            // Spiel als abgeschlossen markieren
            if (!this.gameState.completedGames[this.gameState.currentDay]) {
                this.gameState.completedGames[this.gameState.currentDay] = [];
            }
            
            if (!this.gameState.completedGames[this.gameState.currentDay].includes(gameId)) {
                this.gameState.completedGames[this.gameState.currentDay].push(gameId);
            }
            
            // Erfolgsmeldung und Animation
            UIManager.showGameCompletionMessage(gameId, points, () => {
                SaveLoadManager.saveGameState(this.gameState);
                this.showDayHub();
            });
        } else {
            // Bei Misserfolg zurück zum Hub ohne Punkte
            UIManager.showEncouragementMessage(() => {
                SaveLoadManager.saveGameState(this.gameState);
                this.showDayHub();
            });
        }
    },
    
    /**
     * Fügt neu gelernte Buchstaben hinzu
     */
    learnNewLetters: function() {
        const day = this.gameState.currentDay;
        const difficulty = this.gameState.difficultyLevel;
        const lettersForDay = ContentData.getLettersForDay(day, difficulty);
        
        if (lettersForDay && lettersForDay.length > 0) {
            // Nur neue Buchstaben hinzufügen
            lettersForDay.forEach(letter => {
                if (!this.gameState.majaProgress.learnedLetters.includes(letter)) {
                    this.gameState.majaProgress.learnedLetters.push(letter);
                }
            });
        }
    },
    
    /**
     * Wechselt zum nächsten Tag
     */
    goToNextDay: function() {
        const nextDay = this.gameState.currentDay + 1;
        
        if (nextDay > 35) {
            // Spiel abgeschlossen
            this.showGameCompletion();
        } else {
            // Zum nächsten Tag
            this.goToDay(nextDay);
        }
    },
    
    /**
     * Zeigt den Spielabschluss an (nach Tag 35)
     */
    showGameCompletion: function() {
        UIManager.renderGameCompletion(this.gameState, () => {
            // Zurück zum Startbildschirm
            UIManager.renderStartScreen();
        });
    },
    
    /**
     * Zeigt den Login-Dialog für den Elternbereich an
     */
    showParentAreaLogin: function() {
        UIManager.renderParentAreaLogin((password) => {
            // Hier könnte eine echte Passwortprüfung stehen
            const correctPassword = "Eltern2025";
            
            if (password === correctPassword) {
                this.showParentArea();
            } else {
                UIManager.showErrorMessage("Falsches Passwort. Bitte versuchen Sie es erneut.");
            }
        });
    },
    
    /**
     * Zeigt den Elternbereich an
     */
    showParentArea: function() {
        ParentAreaManager.showParentArea(this.gameState);
    },
    
    /**
     * Aktualisiert die Spieleinstellungen
     * @param {Object} newSettings - Neue Einstellungen
     */
    updateSettings: function(newSettings) {
        this.gameState.settings = {...this.gameState.settings, ...newSettings};
        
        // Audio-Einstellungen aktualisieren
        AudioManager.setMuted(!this.gameState.settings.soundEnabled);
        
        SaveLoadManager.saveGameState(this.gameState);
    },
    
    /**
     * Zeigt Hilfe zum aktuellen Spiel oder allgemeine Hilfe an
     */
    showGameHelp: function() {
        const currentGame = this.gameState.currentGame;
        
        if (currentGame) {
            // Spielspezifische Hilfe anzeigen
            this.showGameSpecificHelp(currentGame);
        } else {
            // Allgemeine Hilfe/Benutzerhandbuch anzeigen
            this.showUserManual();
        }
    },
    
    /**
     * Zeigt spielspezifische Hilfe an
     * @param {string} gameId - ID des Spiels
     */
    showGameSpecificHelp: function(gameId) {
        const helpContent = ContentData.getGameHelp(gameId);
        
        UIManager.showModal(
            "Hilfe: " + ContentData.getGameTitle(gameId),
            helpContent,
            "Verstanden"
        );
    },
    
    /**
     * Zeigt das Benutzerhandbuch an
     */
    showUserManual: function() {
        UIManager.showUserManual();
    }
};