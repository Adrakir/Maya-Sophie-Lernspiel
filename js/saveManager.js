/**
 * Maya-Sophie Lernspiel - Speicher-Manager
 * Verwaltet Spielstände, Fortschritt und Einstellungen
 */

class SaveManager {
    constructor() {
        this.storageKey = 'maya-sophie-game-data';
        this.gameData = this.getDefaultGameData();
        this.autoSaveInterval = null;
        
        console.log('💾 Speicher-Manager erstellt');
    }

    getDefaultGameData() {
        return {
            version: '1.0.0',
            created: new Date().toISOString(),
            lastPlayed: new Date().toISOString(),
            
            // Spielfortschritt
            progress: {
                currentDay: 1,
                completedStories: 0,
                completedGames: [],
                totalStars: 0,
                bonusStars: 0,
                unlockedContent: ['day1'],
                achievements: []
            },
            
            // Statistiken
            statistics: {
                totalPlayTime: 0,
                storiesRead: 0,
                gamesPlayed: 0,
                totalScore: 0,
                averageScore: 0,
                favoriteGame: null,
                learningProgress: {
                    letters: {},
                    words: {},
                    syllables: {}
                }
            },
            
            // Einstellungen
            settings: {
                // Audio
                masterVolume: 0.7,
                musicVolume: 0.5,
                sfxVolume: 0.8,
                speechVolume: 0.9,
                musicEnabled: true,
                sfxEnabled: true,
                speechEnabled: true,
                
                // Gameplay
                difficultyLevel: 'medium', // easy, medium, hard
                autoSaveEnabled: true,
                animationsEnabled: true,
                tutorialCompleted: false,
                
                // Anzeige
                textSize: 'medium', // small, medium, large
                highContrast: false,
                reducedMotion: false,
                
                // Eltern
                parentalControls: {
                    dailyTimeLimit: 30, // Minuten
                    allowBonusGames: true,
                    notificationsEnabled: true
                }
            },
            
            // Tägliche Daten
            dailyData: {},
            
            // Game-spezifische Daten
            gameScores: {},
            
            // Bonusaufgaben
            bonusTasks: {
                readingHouse: 0,
                learningDiary: 0,
                wordLists: 0
            }
        };
    }

    // === LADEN UND SPEICHERN ===
    
    async loadGameState() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                // Datenformat-Migration falls nötig
                this.gameData = this.migrateData(parsedData);
                
                console.log('💾 Spielstand geladen');
            } else {
                console.log('💾 Neuer Spielstand erstellt');
                await this.saveGameState();
            }
            
            // Auto-Save starten
            this.startAutoSave();
            
        } catch (error) {
            console.error('Fehler beim Laden des Spielstands:', error);
            // Fallback zu Default-Daten
            this.gameData = this.getDefaultGameData();
        }
    }

    async saveGameState() {
        try {
            this.gameData.lastPlayed = new Date().toISOString();
            
            const dataToSave = JSON.stringify(this.gameData);
            localStorage.setItem(this.storageKey, dataToSave);
            
            console.log('💾 Spielstand gespeichert');
            return true;
            
        } catch (error) {
            console.error('Fehler beim Speichern des Spielstands:', error);
            
            // Prüfe LocalStorage-Limits
            if (error.name === 'QuotaExceededError') {
                this.handleStorageQuotaExceeded();
            }
            
            return false;
        }
    }

    migrateData(savedData) {
        // Datenformat-Migration für verschiedene Versionen
        const currentVersion = '1.0.0';
        
        if (!savedData.version || savedData.version !== currentVersion) {
            console.log(`📦 Migriere Daten von Version ${savedData.version || 'unbekannt'} zu ${currentVersion}`);
            
            // Merge mit Default-Daten für fehlende Felder
            const migratedData = this.deepMerge(this.getDefaultGameData(), savedData);
            migratedData.version = currentVersion;
            
            return migratedData;
        }
        
        return savedData;
    }

    deepMerge(target, source) {
        const output = Object.assign({}, target);
        
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        
        return output;
    }

    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    // === FORTSCHRITT ===
    
    getCurrentDay() {
        return this.gameData.progress.currentDay;
    }

    setCurrentDay(day) {
        this.gameData.progress.currentDay = Math.max(1, Math.min(35, day));
        this.saveGameState();
    }

    markStoryCompleted(day) {
        if (!this.gameData.progress.completedStories.includes) {
            this.gameData.progress.completedStories = [];
        }
        
        if (!this.gameData.progress.completedStories.includes(day)) {
            this.gameData.progress.completedStories.push(day);
            this.gameData.progress.totalStars++;
            this.gameData.statistics.storiesRead++;
            
            // Nächsten Tag freischalten
            const nextDay = `day${day + 1}`;
            if (day < 35 && !this.gameData.progress.unlockedContent.includes(nextDay)) {
                this.gameData.progress.unlockedContent.push(nextDay);
            }
            
            // Achievement prüfen
            this.checkAchievements();
            
            console.log(`📖 Geschichte Tag ${day} abgeschlossen`);
        }
        
        this.saveGameState();
    }

    addGameScore(gameType, score) {
        if (!this.gameData.gameScores[gameType]) {
            this.gameData.gameScores[gameType] = [];
        }
        
        this.gameData.gameScores[gameType].push({
            score: score,
            date: new Date().toISOString(),
            difficulty: this.gameData.settings.difficultyLevel
        });
        
        // Statistiken aktualisieren
        this.gameData.statistics.gamesPlayed++;
        this.gameData.statistics.totalScore += score;
        this.gameData.statistics.averageScore = Math.round(
            this.gameData.statistics.totalScore / this.gameData.statistics.gamesPlayed
        );
        
        // Lieblingsspiel ermitteln
        this.updateFavoriteGame();
        
        this.saveGameState();
    }

    updateFavoriteGame() {
        const gameCounts = {};
        
        Object.keys(this.gameData.gameScores).forEach(game => {
            gameCounts[game] = this.gameData.gameScores[game].length;
        });
        
        if (Object.keys(gameCounts).length > 0) {
            this.gameData.statistics.favoriteGame = Object.keys(gameCounts).reduce((a, b) => 
                gameCounts[a] > gameCounts[b] ? a : b
            );
        }
    }

    // === BONUSAUFGABEN ===
    
    addBonusTask(taskType, amount = 1) {
        const bonusStars = GameContent.parentArea.bonusTasks[taskType]?.stars || 0;
        const maxPerDay = GameContent.parentArea.bonusTasks[taskType]?.maxPerDay || 99;
        
        const today = new Date().toDateString();
        if (!this.gameData.dailyData[today]) {
            this.gameData.dailyData[today] = { bonusTasks: {} };
        }
        
        const dailyTasks = this.gameData.dailyData[today].bonusTasks;
        const currentDaily = dailyTasks[taskType] || 0;
        
        if (currentDaily < maxPerDay) {
            const addedAmount = Math.min(amount, maxPerDay - currentDaily);
            
            this.gameData.bonusTasks[taskType] += addedAmount;
            dailyTasks[taskType] = currentDaily + addedAmount;
            
            const earnedStars = addedAmount * bonusStars;
            this.gameData.progress.bonusStars += earnedStars;
            this.gameData.progress.totalStars += earnedStars;
            
            console.log(`⭐ ${earnedStars} Bonussterne für ${taskType} erhalten`);
            
            this.saveGameState();
            return earnedStars;
        }
        
        return 0;
    }

    getBonusTasksToday(taskType) {
        const today = new Date().toDateString();
        return this.gameData.dailyData[today]?.bonusTasks?.[taskType] || 0;
    }

    // === EINSTELLUNGEN ===
    
    getSetting(key) {
        return this.getNestedProperty(this.gameData.settings, key);
    }

    updateSettings(settings) {
        this.gameData.settings = { ...this.gameData.settings, ...settings };
        this.saveGameState();
    }

    updateNestedSetting(path, value) {
        this.setNestedProperty(this.gameData.settings, path, value);
        this.saveGameState();
    }

    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key]) current[key] = {};
            return current[key];
        }, obj);
        target[lastKey] = value;
    }

    // === STATISTIKEN UND ANALYTICS ===
    
    getProgress() {
        return this.gameData.progress;
    }

    getStatistics() {
        return this.gameData.statistics;
    }

    addPlayTime(seconds) {
        this.gameData.statistics.totalPlayTime += seconds;
        
        // Heute Spielzeit hinzufügen
        const today = new Date().toDateString();
        if (!this.gameData.dailyData[today]) {
            this.gameData.dailyData[today] = {};
        }
        this.gameData.dailyData[today].playTime = (this.gameData.dailyData[today].playTime || 0) + seconds;
    }

    getTodaysPlayTime() {
        const today = new Date().toDateString();
        return this.gameData.dailyData[today]?.playTime || 0;
    }

    updateLearningProgress(type, item, success) {
        if (!this.gameData.statistics.learningProgress[type]) {
            this.gameData.statistics.learningProgress[type] = {};
        }
        
        if (!this.gameData.statistics.learningProgress[type][item]) {
            this.gameData.statistics.learningProgress[type][item] = {
                attempts: 0,
                successes: 0,
                lastAttempt: null
            };
        }
        
        const progress = this.gameData.statistics.learningProgress[type][item];
        progress.attempts++;
        if (success) progress.successes++;
        progress.lastAttempt = new Date().toISOString();
        
        this.saveGameState();
    }

    // === ACHIEVEMENTS ===
    
    checkAchievements() {
        const achievements = [
            {
                id: 'first_story',
                name: 'Erste Geschichte',
                description: 'Deine erste Geschichte abgeschlossen!',
                condition: () => this.gameData.statistics.storiesRead >= 1
            },
            {
                id: 'week_complete',
                name: 'Eine Woche geschafft',
                description: '7 Geschichten in Folge gelesen',
                condition: () => this.gameData.statistics.storiesRead >= 7
            },
            {
                id: 'game_master',
                name: 'Spielemeister',
                description: '50 Spiele gespielt',
                condition: () => this.gameData.statistics.gamesPlayed >= 50
            },
            {
                id: 'star_collector',
                name: 'Sternensammler',
                description: '100 Sterne gesammelt',
                condition: () => this.gameData.progress.totalStars >= 100
            },
            {
                id: 'bonus_hero',
                name: 'Bonus-Held',
                description: '10 Bonusaufgaben abgeschlossen',
                condition: () => {
                    const total = Object.values(this.gameData.bonusTasks).reduce((sum, val) => sum + val, 0);
                    return total >= 10;
                }
            }
        ];
        
        achievements.forEach(achievement => {
            if (!this.gameData.progress.achievements.includes(achievement.id) && achievement.condition()) {
                this.gameData.progress.achievements.push(achievement.id);
                this.showAchievementNotification(achievement);
            }
        });
    }

    showAchievementNotification(achievement) {
        // Achievement-Notification anzeigen
        if (window.game?.ui) {
            window.game.ui.showNotification(
                `🏆 Achievement freigeschaltet: ${achievement.name}`,
                'success',
                5000
            );
        }
        
        console.log(`🏆 Achievement freigeschaltet: ${achievement.name}`);
    }

    // === AUTO-SAVE ===
    
    startAutoSave() {
        if (this.gameData.settings.autoSaveEnabled) {
            this.autoSaveInterval = setInterval(() => {
                this.autoSave();
            }, 30000); // Alle 30 Sekunden
        }
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    async autoSave() {
        if (this.gameData.settings.autoSaveEnabled) {
            await this.saveGameState();
        }
    }

    // === DATEN-MANAGEMENT ===
    
    exportData() {
        const exportData = {
            ...this.gameData,
            exported: new Date().toISOString(),
            exportVersion: '1.0.0'
        };
        
        return exportData;
    }

    async importData(importedData) {
        try {
            // Validierung der importierten Daten
            if (!this.validateImportData(importedData)) {
                throw new Error('Ungültige Datenstruktur');
            }
            
            // Backup der aktuellen Daten
            const backup = { ...this.gameData };
            
            // Importierte Daten übernehmen
            this.gameData = this.migrateData(importedData);
            
            // Speichern
            const success = await this.saveGameState();
            
            if (!success) {
                // Rollback bei Fehler
                this.gameData = backup;
                throw new Error('Fehler beim Speichern der importierten Daten');
            }
            
            console.log('📥 Daten erfolgreich importiert');
            return true;
            
        } catch (error) {
            console.error('Fehler beim Importieren der Daten:', error);
            return false;
        }
    }

    validateImportData(data) {
        // Grundlegende Validierung der Datenstruktur
        const requiredFields = ['version', 'progress', 'settings', 'statistics'];
        
        return requiredFields.every(field => data.hasOwnProperty(field));
    }

    resetProgress() {
        // Nur Fortschritt zurücksetzen, Einstellungen beibehalten
        const settings = { ...this.gameData.settings };
        this.gameData = this.getDefaultGameData();
        this.gameData.settings = settings;
        
        this.saveGameState();
        console.log('🔄 Fortschritt zurückgesetzt');
    }

    clearAllData() {
        localStorage.removeItem(this.storageKey);
        this.gameData = this.getDefaultGameData();
        console.log('🗑️ Alle Daten gelöscht');
    }

    // === STORAGE-MANAGEMENT ===
    
    handleStorageQuotaExceeded() {
        console.warn('💾 LocalStorage-Limit erreicht, bereinige alte Daten...');
        
        // Alte tägliche Daten entfernen (älter als 30 Tage)
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        
        Object.keys(this.gameData.dailyData).forEach(dateKey => {
            const date = new Date(dateKey);
            if (date < cutoffDate) {
                delete this.gameData.dailyData[dateKey];
            }
        });
        
        // Alte Game-Scores begrenzen (nur die letzten 100 pro Spiel)
        Object.keys(this.gameData.gameScores).forEach(game => {
            if (this.gameData.gameScores[game].length > 100) {
                this.gameData.gameScores[game] = this.gameData.gameScores[game]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 100);
            }
        });
        
        // Erneut versuchen zu speichern
        this.saveGameState();
    }

    getStorageInfo() {
        const data = localStorage.getItem(this.storageKey);
        const size = data ? new Blob([data]).size : 0;
        
        return {
            size: size,
            sizeFormatted: this.formatBytes(size),
            itemCount: Object.keys(this.gameData).length
        };
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}