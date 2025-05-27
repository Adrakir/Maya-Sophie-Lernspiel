// Asset-Loader für Maya & Sophie Lernspiel

class AssetLoader {
    constructor() {
        this.images = {};
        this.sounds = {};
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.progressBar = document.getElementById('load-progress');
        this.loadingScreen = document.getElementById('loading-screen');
    }
    
    // Bilder laden
    loadImages(imageList) {
        return new Promise((resolve) => {
            this.totalAssets += Object.keys(imageList).length;
            
            const promises = [];
            
            for (const [key, path] of Object.entries(imageList)) {
                const img = new Image();
                const promise = new Promise((imgResolve) => {
                    img.onload = () => {
                        this.loadedAssets++;
                        this.updateProgress();
                        imgResolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${path}`);
                        this.loadedAssets++;
                        this.updateProgress();
                        imgResolve();
                    };
                });
                
                img.src = path;
                this.images[key] = img;
                promises.push(promise);
            }
            
            Promise.all(promises).then(resolve);
        });
    }
    
    // Sounds laden
    loadSounds(soundList) {
        return new Promise((resolve) => {
            this.totalAssets += Object.keys(soundList).length;
            
            const promises = [];
            
            for (const [key, path] of Object.entries(soundList)) {
                const audio = new Audio();
                const promise = new Promise((audioResolve) => {
                    audio.oncanplaythrough = () => {
                        this.loadedAssets++;
                        this.updateProgress();
                        audioResolve();
                    };
                    audio.onerror = () => {
                        console.error(`Failed to load sound: ${path}`);
                        this.loadedAssets++;
                        this.updateProgress();
                        audioResolve();
                    };
                });
                
                audio.src = path;
                this.sounds[key] = audio;
                promises.push(promise);
            }
            
            Promise.all(promises).then(resolve);
        });
    }
    
    // Fortschritt aktualisieren
    updateProgress() {
        const progress = (this.loadedAssets / this.totalAssets) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    // Ladebildschirm ein-/ausblenden
    showLoadingScreen() {
        this.loadingScreen.style.display = 'flex';
    }
    
    hideLoadingScreen() {
        this.loadingScreen.style.display = 'none';
    }
}

// Singleton-Instanz exportieren
const loader = new AssetLoader();