/**
 * Maya-Sophie Lernspiel - Hauptanwendung
 * Koordiniert alle Spielkomponenten und verwaltet den Anwendungsfluss
 */

class MayaSophieGame {
    constructor() {
        this.currentDay = 1;
        this.maxDays = 35;
        this.currentScreen = 'loading';
        this.initialized = false;
        
        // Manager-Instanzen
        this.audioManager = new AudioManager();
        this.saveManager = new SaveManager();
        this.storyManager = new StoryManager();
        this.gameEngine = new GameEngine();
        this.parentArea = new ParentArea();
        this.ui = new UIManager();
        
        this.init();
    }
    
    async init() {
        console.log('🎮 Maya-Sophie Lernspiel wird geladen...');
        
        try {
            // Ladefortschritt anzeigen
            this.updateLoadingProgress(10, 'Lade Spieleinstellungen...');
            
            // Spielstand laden
            await this.saveManager.loadGameState();
            this.currentDay = this.saveManager.getCurrentDay();
            
            this.updateLoadingProgress(30, 'Lade Geschichten...');
            
            // Inhalte laden
            await this.storyManager.loadStories();
            
            this.updateLoadingProgress(50, 'Lade Spiele...');
            
            // Spiele initialisieren
            await this.gameEngine.init();
            
            this.updateLoadingProgress(70, 'Lade Audio...');
            
            // Audio-System initialisieren
            await this.audioManager.init();
            
            this.updateLoadingProgress(90, 'Bereite Benutzeroberfläche vor...');
            
            // Event Listeners einrichten
            this.setupEventListeners();
            
            // UI initialisieren
            this.ui.init();
            
            this.updateLoadingProgress(100, 'Fertig!');
            
            // Nach kurzer Verzögerung zum Hauptmenü wechseln
            setTimeout(() => {
                this.showMainMenu();
                this.initialized = true;
                console.log('✅ Spiel erfolgreich geladen!');
            }, 1000);
            
        } catch (error) {
            console.error('❌ Fehler beim Laden des Spiels:', error);
            this.showError('Fehler beim Laden des Spiels. Bitte versuche es erneut.');
        }
    }
    
    updateLoadingProgress(percent, message) {
        const progressBar = document.getElementById('loadingProgress');
        const loadingText = document.querySelector('.loading-content h2');
        
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        
        if (loadingText && message) {
            loadingText.textContent = message;
        }
    }
    
    setupEventListeners() {
        // Hauptmenü-Events
        document.getElementById('startStoryBtn')?.addEventListener('click', () => {
            this.startDailyStory();
        });
        
        document.getElementById('gamesBtn')?.addEventListener('click', () => {
            this.showGamesScreen();
        });
        
        document.getElementById('parentAreaBtn')?.addEventListener('click', () => {
            this.showParentArea();
        });
        
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettings();
        });
        
        document.getElementById('helpBtn')?.addEventListener('click', () => {
            this.showHelp();
        });
        
        // Zurück-Buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showMainMenu();
            });
        });
        
        // Story-Navigation
        document.getElementById('nextStoryBtn')?.addEventListener('click', () => {
            this.storyManager.nextStoryPart();
        });
        
        document.getElementById('prevStoryBtn')?.addEventListener('click', () => {
            this.storyManager.prevStoryPart();
        });
        
        document.getElementById('completeStoryBtn')?.addEventListener('click', () => {
            this.completeStory();
        });
        
        // Audio-Controls
        document.getElementById('storyAudioBtn')?.addEventListener('click', () => {
            this.audioManager.playStoryAudio();
        });
        
        document.getElementById('storyPauseBtn')?.addEventListener('click', () => {
            this.audioManager.pauseAudio();
        });
        
        // Spiele-Events
        document.querySelectorAll('.game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameType = e.currentTarget.dataset.game;
                this.startGame(gameType);
            });
        });
        
        // Einstellungen
        this.setupSettingsListeners();
        
        // Keyboard-Navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
        
        // Auto-Save
        setInterval(() => {
            if (this.initialized) {
                this.saveManager.autoSave();
            }
        }, 30000); // Alle 30 Sekunden
    }
    
    setupSettingsListeners() {
        // Lautstärke
        document.getElementById('masterVolume')?.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audioManager.setMasterVolume(volume);
            document.getElementById('volumeDisplay').textContent = `${e.target.value}%`;
        });
        
        // Musik an/aus
        document.getElementById('musicEnabled')?.addEventListener('change', (e) => {
            this.audioManager.setMusicEnabled(e.target.checked);
        });
        
        // Soundeffekte an/aus
        document.getElementById('soundEffects')?.addEventListener('change', (e) => {
            this.audioManager.setSoundEffectsEnabled(e.target.checked);
        });
        
        // Textgröße
        document.getElementById('textSize')?.addEventListener('change', (e) => {
            this.setTextSize(e.target.value);
        });
        
        // Fortschritt zurücksetzen
        document.getElementById('resetProgressBtn')?.addEventListener('click', () => {
            this.resetProgress();
        });
        
        // Daten exportieren
        document.getElementById('exportDataBtn')?.addEventListener('click', () => {
            this.exportGameData();
        });
    }
    
    showMainMenu() {
        this.hideAllScreens();
        document.getElementById('mainMenu').classList.remove('hidden');
        this.currentScreen = 'menu';
        
        // Aktuellen Tag anzeigen
        document.getElementById('currentDay').textContent = `Tag ${this.currentDay} von ${this.maxDays}`;
        
        // Fortschritt aktualisieren
        this.updateProgressDisplay();
        
        // Hintergrundmusik starten
        this.audioManager.playBackgroundMusic('main-theme');
        
        // Willkommensnachricht anpassen
        this.updateWelcomeMessage();
    }
    
    updateWelcomeMessage() {
        const welcomeEl = document.getElementById('welcomeMessage');
        const h2 = welcomeEl.querySelector('h2');
        
        const progress = this.saveManager.getProgress();
        const completedStories = progress.completedStories || 0;
        
        if (completedStories === 0) {
            h2.textContent = 'Willkommen bei Maya & Sophie!';
        } else if (completedStories < 10) {
            h2.textContent = 'Schön, dass du wieder da bist!';
        } else if (completedStories < 25) {
            h2.textContent = 'Du machst tolle Fortschritte!';
        } else if (completedStories < 35) {
            h2.textContent = 'Du bist fast am Ziel!';
        } else {
            h2.textContent = 'Herzlichen Glückwunsch!';
        }
    }
    
    updateProgressDisplay() {
        const progress = this.saveManager.getProgress();
        const starsContainer = document.getElementById('progressStars');
        const progressText = document.getElementById('progressText');
        
        // Sterne generieren
        starsContainer.innerHTML = '';
        for (let i = 1; i <= this.maxDays; i++) {
            const star = document.createElement('span');
            star.className = `star ${progress.completedStories >= i ? 'earned' : 'unearned'}`;
            star.textContent = '⭐';
            star.title = `Tag ${i}`;
            starsContainer.appendChild(star);
        }
        
        // Fortschrittstext
        const completed = progress.completedStories || 0;
        progressText.textContent = `${completed} von ${this.maxDays} Geschichten gelesen`;
        
        // Bonussterne hinzufügen
        const bonusStars = progress.bonusStars || 0;
        if (bonusStars > 0) {
            const bonusContainer = document.createElement('div');
            bonusContainer.className = 'bonus-stars';
            bonusContainer.innerHTML = `<span>Bonus: ${bonusStars} 🌟</span>`;
            starsContainer.parentNode.insertBefore(bonusContainer, progressText);
        }
    }
    
    async startDailyStory() {
        try {
            this.hideAllScreens();
            document.getElementById('storyScreen').classList.remove('hidden');
            this.currentScreen = 'story';
            
            // Story laden und anzeigen
            await this.storyManager.loadDailyStory(this.currentDay);
            
            // Audio für Story vorbereiten
            this.audioManager.playBackgroundMusic('story-theme');
            
            // Story-Titel setzen
            const storyData = this.storyManager.getCurrentStory();
            document.getElementById('storyTitle').textContent = storyData.title;
            
        } catch (error) {
            console.error('Fehler beim Laden der Geschichte:', error);
            this.showError('Fehler beim Laden der Geschichte.');
        }
    }
    
    completeStory() {
        // Story als abgeschlossen markieren
        this.saveManager.markStoryCompleted(this.currentDay);
        
        // Belohnung zeigen
        this.showStoryReward();
        
        // Nächsten Tag freischalten (falls verfügbar)
        if (this.currentDay < this.maxDays) {
            this.currentDay++;
            this.saveManager.setCurrentDay(this.currentDay);
        }
        
        // Zurück zum Hauptmenü
        setTimeout(() => {
            this.showMainMenu();
        }, 3000);
    }
    
    showStoryReward() {
        // Erfolgs-Animation und Sound
        this.audioManager.playSound('success');
        this.ui.showNotification('Geschichte abgeschlossen! ⭐', 'success');
        
        // Konfetti-Animation (falls verfügbar)
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
    
    showGamesScreen() {
        this.hideAllScreens();
        document.getElementById('gamesScreen').classList.remove('hidden');
        this.currentScreen = 'games';
        
        this.audioManager.playBackgroundMusic('games-theme');
    }
    
    async startGame(gameType) {
        try {
            this.hideAllScreens();
            document.getElementById('gameContainer').classList.remove('hidden');
            this.currentScreen = 'game';
            
            // Spiel initialisieren
            await this.gameEngine.startGame(gameType);
            
            // Game-spezifische Musik
            this.audioManager.playBackgroundMusic('game-theme');
            
        } catch (error) {
            console.error('Fehler beim Starten des Spiels:', error);
            this.showError('Fehler beim Starten des Spiels.');
        }
    }
    
    showParentArea() {
        this.hideAllScreens();
        document.getElementById('parentScreen').classList.remove('hidden');
        this.currentScreen = 'parent';
        
        // Elternbereich initialisieren
        this.parentArea.init();
        
        this.audioManager.playBackgroundMusic('calm-theme');
    }
    
    showSettings() {
        this.hideAllScreens();
        document.getElementById('settingsScreen').classList.remove('hidden');
        this.currentScreen = 'settings';
        
        // Aktuelle Einstellungen laden
        this.loadCurrentSettings();
    }
    
    showHelp() {
        this.hideAllScreens();
        document.getElementById('helpScreen').classList.remove('hidden');
        this.currentScreen = 'help';
        
        // Hilfe-Events einrichten
        this.setupHelpEvents();
    }
    
    setupHelpEvents() {
        document.querySelectorAll('.help-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const helpType = e.currentTarget.dataset.help;
                this.showHelpModal(helpType);
            });
        });
    }
    
    showHelpModal(helpType) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');
        
        let content = '';
        
        switch (helpType) {
            case 'tutorial':
                content = this.getTutorialContent();
                break;
            case 'stories':
                content = this.getStoriesHelpContent();
                break;
            case 'games':
                content = this.getGamesHelpContent();
                break;
            case 'parents':
                content = this.getParentsHelpContent();
                break;
        }
        
        modalBody.innerHTML = content;
        modal.classList.remove('hidden');
        
        // Modal schließen
        document.getElementById('modalClose').onclick = () => {
            modal.classList.add('hidden');
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        };
    }
    
    getTutorialContent() {
        return `
            <h3>📚 Tutorial</h3>
            <div class="tutorial-content">
                <h4>Willkommen bei Maya & Sophie!</h4>
                <p>Dieses Spiel hilft dir beim Lesen lernen. Jeden Tag gibt es eine neue Geschichte mit Maya, Sophie und dem kleinen Luca.</p>
                
                <h4>So funktioniert's:</h4>
                <ol>
                    <li><strong>Tägliche Geschichte:</strong> Lies jeden Tag eine neue Geschichte</li>
                    <li><strong>Lernspiele:</strong> Spiele Spiele, um das Gelernte zu üben</li>
                    <li><strong>Sterne sammeln:</strong> Für jede abgeschlossene Geschichte bekommst du einen Stern</li>
                    <li><strong>Bonusaufgaben:</strong> Deine Eltern können dir extra Sterne geben</li>
                </ol>
                
                <h4>Navigation:</h4>
                <p>Nutze die Buttons am oberen Rand, um zwischen den Bereichen zu wechseln. Der "Zurück"-Button bringt dich immer zum Hauptmenü.</p>
                
                <button class="tutorial-btn" onclick="document.getElementById('modal').classList.add('hidden')">Tutorial schließen</button>
            </div>
        `;
    }
    
    getStoriesHelpContent() {
        return `
            <h3>📖 Geschichten</h3>
            <div class="help-content">
                <p>Die Geschichten erzählen das Abenteuer von Maya und Sophie, die ihren kleinen Bruder Luca vor dem Fluch der Hexe Crunella retten müssen.</p>
                
                <h4>Story-Features:</h4>
                <ul>
                    <li>35 Tage mit je einer Geschichte</li>
                    <li>Interaktive Bilderbücher</li>
                    <li>Audio-Unterstützung (Vorlesen)</li>
                    <li>Lernfokus auf Buchstaben und Silben</li>
                </ul>
                
                <h4>Navigation:</h4>
                <ul>
                    <li>Nutze "Weiter" und "Zurück" um durch die Geschichte zu blättern</li>
                    <li>Klicke auf 🔊 um dir die Geschichte vorlesen zu lassen</li>
                    <li>Am Ende kannst du die Geschichte abschließen</li>
                </ul>
            </div>
        `;
    }
    
    getGamesHelpContent() {
        return `
            <h3>🎮 Lernspiele</h3>
            <div class="help-content">
                <p>Die Spiele sind nach Schwierigkeitsgrad und Lerninhalt sortiert:</p>
                
                <h4>Schwierigkeitsgrade:</h4>
                <ul>
                    <li><span class="difficulty easy">Leicht</span> - Für Anfänger (1. Klasse)</li>
                    <li><span class="difficulty medium">Mittel</span> - Für Fortgeschrittene (1.-2. Klasse)</li>
                    <li><span class="difficulty hard">Schwer</span> - Für Profis (2. Klasse)</li>
                </ul>
                
                <h4>Spielkategorien:</h4>
                <ul>
                    <li><strong>Buchstaben & Lesen:</strong> Memory, Wörter bauen, Lese-Rennen</li>
                    <li><strong>Zahlen & Rechnen:</strong> Zählen, einfache Rechenaufgaben</li>
                    <li><strong>Bonusspiele:</strong> Gedächtnistraining, Farben</li>
                </ul>
            </div>
        `;
    }
    
    getParentsHelpContent() {
        return `
            <h3>👨‍👩‍👧‍👦 Elternbereich</h3>
            <div class="help-content">
                <p>Hier können Eltern den Fortschritt verfolgen und Bonussterne vergeben:</p>
                
                <h4>Fortschritt verfolgen:</h4>
                <ul>
                    <li>Übersicht über abgeschlossene Geschichten</li>
                    <li>Spielzeit und Lernfortschritt</li>
                    <li>Detaillierte Statistiken</li>
                </ul>
                
                <h4>Bonusaufgaben:</h4>
                <ul>
                    <li><strong>Lesehäuser:</strong> +5 Sterne pro gelesenes Buch</li>
                    <li><strong>Lerntagebuch:</strong> +3 Sterne pro Eintrag</li>
                    <li><strong>Wortlisten:</strong> +2 Sterne pro Liste</li>
                </ul>
                
                <h4>Einstellungen:</h4>
                <ul>
                    <li>Schwierigkeitsgrad anpassen</li>
                    <li>Tägliche Spielzeit begrenzen</li>
                    <li>Audio-Einstellungen</li>
                </ul>
            </div>
        `;
    }
    
    loadCurrentSettings() {
        const settings = this.saveManager.getSettings();
        
        // Lautstärke
        document.getElementById('masterVolume').value = settings.volume * 100;
        document.getElementById('volumeDisplay').textContent = `${Math.round(settings.volume * 100)}%`;
        
        // Audio-Einstellungen
        document.getElementById('musicEnabled').checked = settings.musicEnabled;
        document.getElementById('soundEffects').checked = settings.soundEffectsEnabled;
        
        // Anzeige-Einstellungen
        document.getElementById('textSize').value = settings.textSize;
        document.getElementById('animations').checked = settings.animationsEnabled;
        
        // Spiel-Einstellungen
        document.getElementById('autoSave').checked = settings.autoSaveEnabled;
    }
    
    setTextSize(size) {
        document.body.className = document.body.className.replace(/text-size-\w+/g, '');
        document.body.classList.add(`text-size-${size}`);
        this.saveManager.updateSettings({ textSize: size });
    }
    
    resetProgress() {
        if (confirm('Möchtest du wirklich den gesamten Fortschritt zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
            this.saveManager.resetProgress();
            this.currentDay = 1;
            this.showMainMenu();
            this.ui.showNotification('Fortschritt wurde zurückgesetzt', 'info');
        }
    }
    
    exportGameData() {
        const data = this.saveManager.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `maya-sophie-spielstand-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.ui.showNotification('Spielstand wurde exportiert', 'success');
    }
    
    handleKeyboardInput(e) {
        // Escape-Taste: Zurück zum Hauptmenü
        if (e.key === 'Escape' && this.currentScreen !== 'menu') {
            this.showMainMenu();
            return;
        }
        
        // Pfeiltasten für Story-Navigation
        if (this.currentScreen === 'story') {
            if (e.key === 'ArrowLeft') {
                this.storyManager.prevStoryPart();
            } else if (e.key === 'ArrowRight') {
                this.storyManager.nextStoryPart();
            }
        }
        
        // Leertaste für Audio
        if (e.key === ' ' && this.currentScreen === 'story') {
            e.preventDefault();
            this.audioManager.toggleStoryAudio();
        }
    }
    
    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
    }
    
    showError(message) {
        this.ui.showNotification(message, 'error');
        console.error('Game Error:', message);
    }
}

// Spiel initialisieren wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    window.game = new MayaSophieGame();
});

// Service Worker für Offline-Funktionalität (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}