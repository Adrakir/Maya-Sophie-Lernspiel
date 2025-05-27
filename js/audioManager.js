/**
 * Maya-Sophie Lernspiel - Audio-Manager
 * Verwaltet alle Audio-Funktionen: Musik, Soundeffekte, Sprachausgabe
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.backgroundMusic = null;
        this.soundEffects = new Map();
        this.speechSynthesis = null;
        
        // Einstellungen
        this.settings = {
            masterVolume: 0.7,
            musicVolume: 0.5,
            sfxVolume: 0.8,
            speechVolume: 0.9,
            musicEnabled: true,
            sfxEnabled: true,
            speechEnabled: true
        };
        
        // Aktuell spielende Sounds
        this.currentMusic = null;
        this.musicFadeInterval = null;
        
        // Sprachausgabe
        this.voices = [];
        this.currentVoice = null;
        
        console.log('🎵 Audio-Manager erstellt');
    }

    async init() {
        try {
            // Web Audio API initialisieren
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Speech Synthesis initialisieren
            this.initSpeechSynthesis();
            
            // Audio-Dateien vorladen
            await this.preloadAudio();
            
            // Event Listeners
            this.setupEventListeners();
            
            console.log('✅ Audio-Manager erfolgreich initialisiert');
            
        } catch (error) {
            console.warn('⚠️ Audio-Manager konnte nicht vollständig initialisiert werden:', error);
            // Fallback ohne Audio-Features
            this.audioContext = null;
        }
    }

    // === MUSIK-FUNKTIONEN ===
    
    async playBackgroundMusic(themeName, fadeIn = true) {
        if (!this.settings.musicEnabled) return;

        try {
            // Aktuelle Musik fade out
            if (this.currentMusic) {
                await this.fadeOutMusic();
            }

            // Neue Musik laden
            const musicFile = GameContent.audio.backgroundMusic[themeName];
            if (!musicFile) {
                console.warn(`Musik-Thema '${themeName}' nicht gefunden`);
                return;
            }

            this.currentMusic = new Audio(musicFile);
            this.currentMusic.loop = true;
            this.currentMusic.volume = fadeIn ? 0 : this.settings.musicVolume * this.settings.masterVolume;

            this.currentMusic.play();

            // Fade In
            if (fadeIn) {
                await this.fadeInMusic();
            }

            console.log(`🎵 Hintergrundmusik '${themeName}' gestartet`);

        } catch (error) {
            console.warn('Fehler beim Abspielen der Hintergrundmusik:', error);
        }
    }

    async fadeInMusic(duration = 2000) {
        if (!this.currentMusic) return;

        const targetVolume = this.settings.musicVolume * this.settings.masterVolume;
        const steps = 50;
        const stepDuration = duration / steps;
        const volumeStep = targetVolume / steps;

        for (let i = 0; i <= steps; i++) {
            setTimeout(() => {
                if (this.currentMusic) {
                    this.currentMusic.volume = Math.min(volumeStep * i, targetVolume);
                }
            }, stepDuration * i);
        }
    }

    async fadeOutMusic(duration = 1000) {
        if (!this.currentMusic) return;

        const startVolume = this.currentMusic.volume;
        const steps = 30;
        const stepDuration = duration / steps;
        const volumeStep = startVolume / steps;

        return new Promise(resolve => {
            for (let i = steps; i >= 0; i--) {
                setTimeout(() => {
                    if (this.currentMusic) {
                        this.currentMusic.volume = Math.max(volumeStep * i, 0);
                        if (i === 0) {
                            this.currentMusic.pause();
                            this.currentMusic = null;
                            resolve();
                        }
                    }
                }, stepDuration * (steps - i));
            }
        });
    }

    stopBackgroundMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }

    // === SOUNDEFFEKT-FUNKTIONEN ===
    
    playSound(soundName, volume = 1.0) {
        if (!this.settings.sfxEnabled) return;

        const sound = this.soundEffects.get(soundName);
        if (!sound) {
            console.warn(`Sound '${soundName}' nicht gefunden`);
            return;
        }

        try {
            // Klone das Audio-Element für mehrfache Wiedergabe
            const audioClone = sound.cloneNode();
            audioClone.volume = this.settings.sfxVolume * this.settings.masterVolume * volume;
            audioClone.play();

            // Aufräumen nach Wiedergabe
            audioClone.addEventListener('ended', () => {
                audioClone.remove();
            });

        } catch (error) {
            console.warn(`Fehler beim Abspielen von Sound '${soundName}':`, error);
        }
    }

    // === SPRACHAUSGABE ===
    
    speak(text, options = {}) {
        if (!this.settings.speechEnabled || !this.speechSynthesis) return;

        // Vorherige Sprache stoppen
        this.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Einstellungen
        utterance.voice = this.currentVoice;
        utterance.volume = this.settings.speechVolume * this.settings.masterVolume;
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1.0;
        utterance.lang = 'de-DE';

        // Events
        utterance.onstart = () => {
            console.log(`🗣️ Spreche: "${text}"`);
        };

        utterance.onerror = (event) => {
            console.warn('Fehler bei Sprachausgabe:', event.error);
        };

        this.speechSynthesis.speak(utterance);
        return utterance;
    }

    stopSpeaking() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
    }

    // === STORY-AUDIO ===
    
    playStoryAudio(storyText) {
        // Bereite Text für Sprachausgabe vor
        const cleanText = this.prepareTextForSpeech(storyText);
        return this.speak(cleanText, { rate: 0.8, pitch: 1.1 });
    }

    playLetterSound(letter) {
        // Buchstaben-Sound abspielen
        const phonetics = {
            'A': 'Ah', 'B': 'Beh', 'C': 'Ceh', 'D': 'Deh', 'E': 'Eh',
            'F': 'Eff', 'G': 'Geh', 'H': 'Hah', 'I': 'Ih', 'J': 'Jott',
            'K': 'Kah', 'L': 'Ell', 'M': 'Emm', 'N': 'Enn', 'O': 'Oh',
            'P': 'Peh', 'Q': 'Kuh', 'R': 'Err', 'S': 'Ess', 'T': 'Teh',
            'U': 'Uh', 'V': 'Fau', 'W': 'Weh', 'X': 'Iks', 'Y': 'Üpsilon',
            'Z': 'Zett', 'Ä': 'Äh', 'Ö': 'Öh', 'Ü': 'Üh'
        };

        const pronunciation = phonetics[letter.toUpperCase()] || letter;
        this.speak(pronunciation, { rate: 0.7 });
    }

    playWordSound(word) {
        // Wort langsam und deutlich aussprechen
        this.speak(word, { rate: 0.6, pitch: 1.0 });
    }

    prepareTextForSpeech(text) {
        // Text für Sprachausgabe optimieren
        return text
            .replace(/[„"]/g, '"')
            .replace(/[‚'']/g, "'")
            .replace(/…/g, '...')
            .replace(/–/g, '-')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // === AUDIO-EINSTELLUNGEN ===
    
    setMasterVolume(volume) {
        this.settings.masterVolume = Math.max(0, Math.min(1, volume));
        
        // Aktuelle Musik anpassen
        if (this.currentMusic) {
            this.currentMusic.volume = this.settings.musicVolume * this.settings.masterVolume;
        }
    }

    setMusicEnabled(enabled) {
        this.settings.musicEnabled = enabled;
        if (!enabled && this.currentMusic) {
            this.stopBackgroundMusic();
        }
    }

    setSoundEffectsEnabled(enabled) {
        this.settings.sfxEnabled = enabled;
    }

    setSpeechEnabled(enabled) {
        this.settings.speechEnabled = enabled;
        if (!enabled) {
            this.stopSpeaking();
        }
    }

    // === HILFSMETHODEN ===
    
    setupEventListeners() {
        // Audio Context Resume (für Browser-Autoplay-Policy)
        document.addEventListener('click', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });

        // Visibility API - Musik pausieren wenn Tab nicht aktiv
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.currentMusic) {
                    this.currentMusic.pause();
                }
            } else {
                if (this.currentMusic && this.settings.musicEnabled) {
                    this.currentMusic.play();
                }
            }
        });
    }

    async preloadAudio() {
        const audioFiles = GameContent.audio;
        const allFiles = {
            ...audioFiles.backgroundMusic,
            ...audioFiles.soundEffects
        };

        const loadPromises = Object.entries(allFiles).map(async ([key, url]) => {
            try {
                const audio = new Audio(url);
                audio.preload = 'auto';
                
                return new Promise((resolve) => {
                    const onLoad = () => {
                        this.soundEffects.set(key, audio);
                        resolve();
                    };
                    
                    const onError = () => {
                        console.warn(`⚠️ Audio-Datei konnte nicht geladen werden: ${url}`);
                        this.createFallbackSound(key);
                        resolve();
                    };
                    
                    audio.addEventListener('canplaythrough', onLoad, { once: true });
                    audio.addEventListener('error', onError, { once: true });
                    
                    // Timeout als Fallback
                    setTimeout(() => {
                        if (!this.soundEffects.has(key)) {
                            this.createFallbackSound(key);
                        }
                        resolve();
                    }, 3000);
                });
                
            } catch (error) {
                console.warn(`⚠️ Fehler beim Laden von ${url}:`, error);
                this.createFallbackSound(key);
            }
        });

        await Promise.allSettled(loadPromises);
        console.log(`🎵 ${this.soundEffects.size} Audio-Dateien geladen`);
    }

    initSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
            
            const loadVoices = () => {
                this.voices = this.speechSynthesis.getVoices();
                
                // Deutsche Stimme suchen
                this.currentVoice = this.voices.find(voice => 
                    voice.lang.startsWith('de') || 
                    voice.name.toLowerCase().includes('german') ||
                    voice.name.toLowerCase().includes('deutsch')
                ) || this.voices[0];
                
                console.log(`🗣️ Speech Synthesis bereit. Stimme: ${this.currentVoice?.name || 'Standard'}`);
            };

            if (this.speechSynthesis.getVoices().length > 0) {
                loadVoices();
            } else {
                this.speechSynthesis.addEventListener('voiceschanged', loadVoices);
            }
        }
    }

    createFallbackSound(key) {
        // Dummy-Sound für fehlerhafte Audio-Dateien
        this.soundEffects.set(key, {
            play: () => {
                if (this.settings.sfxEnabled) {
                    console.log(`🔊 ${key} (Fallback-Sound)`);
                }
            },
            cloneNode: () => ({
                play: () => {},
                addEventListener: () => {},
                remove: () => {}
            })
        });
    }

    // === SPEZIELLE STORY-SOUNDS ===
    
    playMishapSound(mishapType) {
        const mishapSounds = {
            'lama': 'magic',
            'qualle': 'bubble',
            'schwebendesTeddy': 'magic',
            'kitzlicherTintenfisch': 'bubble',
            'singendeKatze': 'whistle',
            'tanzendeSpielzeuge': 'chime'
        };

        const soundName = mishapSounds[mishapType] || 'magic';
        this.playSound(soundName);
    }

    playCharacterSound(character) {
        const characterSounds = {
            'maja': 'chime',
            'sophie': 'star',
            'luca': 'bubble',
            'crunella': 'magic'
        };

        const soundName = characterSounds[character] || 'click';
        this.playSound(soundName);
    }

    // Audio für Tutorial
    playTutorialNarration(step) {
        const tutorialTexts = {
            welcome: "Willkommen bei Maya und Sophie! Hier lernst du lesen und erlebst spannende Abenteuer.",
            stories: "Jeden Tag gibt es eine neue Geschichte. Klicke auf 'Heutige Geschichte' um zu beginnen.",
            games: "In den Lernspielen kannst du das Gelernte üben und Spaß haben.",
            progress: "Für jede abgeschlossene Geschichte bekommst du einen Stern!",
            help: "Falls du Hilfe brauchst, klicke auf das Fragezeichen."
        };

        const text = tutorialTexts[step];
        if (text) {
            this.speak(text, { rate: 0.9, pitch: 1.1 });
        }
    }
}