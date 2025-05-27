// Hauptfunktionalität für Maya & Sophie: Der Fluch der Hexe Crunella

// Spielmodule und ihre Inhalte
const gameModules = [
    { id: 'alphabet', name: 'Alphabeteinführung', description: 'Lerne das Alphabet kennen', difficulty: 1 },
    { id: 'bingo', name: 'Buchstaben-Bingo', description: 'Finde die Buchstaben auf deiner Bingo-Karte', difficulty: 1 },
    { id: 'syllables', name: 'Silbenklatschen', description: 'Klatsche im Rhythmus der Silben', difficulty: 2 },
    { id: 'treasure', name: 'Schatzsuche', description: 'Suche nach versteckten Buchstaben und Wörtern', difficulty: 2 },
    { id: 'story', name: 'Interaktive Geschichte', description: 'Hilf Maya und Sophie, die Geschichte zu vervollständigen', difficulty: 3 },
    { id: 'flash', name: 'Blitzwörter', description: 'Wie schnell kannst du die Wörter lesen?', difficulty: 3 },
    { id: 'pairs', name: 'Wortpaare', description: 'Finde die passenden Reimwörter', difficulty: 2 },
    { id: 'dice', name: 'Lesewürfel', description: 'Würfle und lies die Wörter', difficulty: 3 },
    { id: 'chain', name: 'Wortkette', description: 'Bilde eine Kette aus Wörtern', difficulty: 4 },
    { id: 'bookworm', name: 'Bücherwurm', description: 'Hilf dem Bücherwurm durch die Bücher zu kriechen', difficulty: 4 },
    { id: 'grid', name: 'Wortgitter', description: 'Finde Wörter im Buchstabengitter', difficulty: 4 },
    { id: 'mouse', name: 'Lückentext Maus', description: 'Ergänze die fehlenden Wörter', difficulty: 4 },
    { id: 'picture', name: 'Bildergeschichte', description: 'Erzähle deine eigene Geschichte zu den Bildern', difficulty: 3 },
    { id: 'puzzle', name: 'Rätselgeschichte', description: 'Löse das Rätsel, um die Geschichte fortzusetzen', difficulty: 4 },
    { id: 'search', name: 'Bildersuche', description: 'Finde die versteckten Gegenstände im Bild', difficulty: 2 },
    { id: 'balloon', name: 'Ballonschießen', description: 'Schieße auf die Ballons mit den richtigen Buchstaben', difficulty: 3 },
    { id: 'vowels', name: 'Vokalsammler', description: 'Sammle alle Vokale in den Wörtern', difficulty: 2 }
];

// Tutorial-Inhalte
const tutorialPages = [
    {
        title: "Willkommen bei Maya & Sophie!",
        content: `
            <div class="tutorial-page">
                <img src="assets/tutorial/welcome.png" alt="Willkommen" style="width: 100%; max-width: 400px; display: block; margin: 0 auto 20px auto;">
                <p>Hallo! Wir sind Maya und Sophie und wir brauchen deine Hilfe!</p>
                <p>Die böse Hexe Crunella hat einen Fluch über unser Dorf gelegt, und nur du kannst uns helfen, ihn zu brechen!</p>
                <p>In diesem Spiel wirst du 17 spannende Abenteuer erleben, die dir beim Lesen und Schreiben helfen werden.</p>
            </div>
        `
    },
    {
        title: "So spielst du",
        content: `
            <div class="tutorial-page">
                <img src="assets/tutorial/howtoplay.png" alt="Spielanleitung" style="width: 100%; max-width: 400px; display: block; margin: 0 auto 20px auto;">
                <p>Um zu spielen, wähle einfach eines der 17 Spiele aus dem Hauptmenü.</p>
                <p>Jedes Spiel hat seine eigenen Regeln, aber keine Sorge - Maya und Sophie werden dir alles erklären!</p>
                <p>Sammle Punkte, indem du die Spiele meisterst, und hilf uns, den Fluch zu brechen!</p>
            </div>
        `
    },
    {
        title: "Hilfe bekommen",
        content: `
            <div class="tutorial-page">
                <img src="assets/tutorial/help.png" alt="Hilfe" style="width: 100%; max-width: 400px; display: block; margin: 0 auto 20px auto;">
                <p>Brauchst du Hilfe? Kein Problem!</p>
                <p>Klicke einfach auf den Hilfe-Button (?) in jedem Spiel, und wir werden dir erklären, was zu tun ist.</p>
                <p>Du kannst auch jederzeit zum Hauptmenü zurückkehren, indem du auf den Zurück-Button klickst.</p>
            </div>
        `
    }
];

// Kinderhandbuch
const kidsManual = `
<div class="kids-manual">
    <h2>Maya & Sophie: Der Fluch der Hexe Crunella</h2>
    <h3>Handbuch für Kinder</h3>
    
    <div class="manual-section">
        <h4>Hallo, liebe Kinder!</h4>
        <p>Wir sind Maya und Sophie, und wir brauchen eure Hilfe! Die böse Hexe Crunella hat einen Fluch über unser Dorf gelegt. Nur mit eurer Hilfe können wir den Fluch brechen!</p>
    </div>
    
    <div class="manual-section">
        <h4>So spielt ihr:</h4>
        <ol>
            <li><strong>Klickt auf "Spiel starten"</strong> um die Abenteuer zu beginnen!</li>
            <li><strong>Wählt ein Spiel aus</strong> - es gibt 17 verschiedene Spiele!</li>
            <li><strong>Folgt den Anweisungen</strong> in jedem Spiel</li>
            <li><strong>Sammelt Punkte und Belohnungen</strong> für jedes abgeschlossene Spiel</li>
            <li><strong>Brecht den Fluch</strong> indem ihr alle Spiele meistert!</li>
        </ol>
    </div>
    
    <div class="manual-section">
        <h4>Unsere Spiele:</h4>
        <ul>
            <li><strong>🔤 Alphabeteinführung</strong><br>Lernt das Alphabet kennen! Klickt auf die Buchstaben, um ihren Laut zu hören.</li>
            <li><strong>🎮 Buchstaben-Bingo</strong><br>Findet die Buchstaben auf eurer Bingo-Karte! Schafft ihr es, eine Reihe zu vervollständigen?</li>
            <!-- Weitere Spiele hier... -->
        </ul>
    </div>
    
    <div class="manual-section">
        <h4>Wenn ihr Hilfe braucht:</h4>
        <ul>
            <li>Klickt auf den <strong>Hilfe-Button (?)</strong> in jedem Spiel</li>
            <li>Fragt Maya und Sophie - sie geben euch Tipps!</li>
            <li>Schaut euch das <strong>Tutorial</strong> an, bevor ihr startet</li>
        </ul>
    </div>
    
    <div class="manual-section">
        <h4>Viel Spaß beim Spielen und Lernen!</h4>
        <p>Eure Freunde,<br>Maya und Sophie</p>
    </div>
</div>
`;

// Elternhandbuch (gekürzt für Übersichtlichkeit)
const parentsManual = `
<div class="parents-manual">
    <h2>Maya & Sophie: Der Fluch der Hexe Crunella</h2>
    <h3>Handbuch für Eltern und Pädagogen</h3>
    
    <div class="manual-section">
        <h4>Einführung</h4>
        <p>"Maya & Sophie: Der Fluch der Hexe Crunella" ist ein interaktives Lernspiel für Kinder im Grundschulalter, das spielerisch Lese- und Schreibkompetenzen fördert. Eingebettet in eine spannende Geschichte rund um die Figuren Maya und Sophie, absolvieren die Kinder verschiedene Lernspiele, um den "Fluch" der Hexe Crunella zu brechen.</p>
    </div>
    
    <div class="manual-section">
        <h4>Pädagogisches Konzept</h4>
        <p>Das Spiel basiert auf einem ganzheitlichen Ansatz zur Sprachförderung, der folgende Bereiche umfasst:</p>
        <ul>
            <li><strong>Phonologische Bewusstheit</strong>: Erkennen und Unterscheiden von Lauten</li>
            <li><strong>Buchstabenkenntnis</strong>: Erlernen von Buchstaben und deren Lauten</li>
            <li><strong>Wortschatz</strong>: Erweiterung des aktiven und passiven Wortschatzes</li>
            <li><strong>Lesekompetenz</strong>: Vom Buchstabieren bis zum flüssigen Lesen</li>
            <li><strong>Schreibkompetenz</strong>: Vom Buchstaben zum Wort und Satz</li>
        </ul>
    </div>
    
    <!-- Weitere Abschnitte hier... -->
</div>
`;

// Spieleinrichtung
document.addEventListener('DOMContentLoaded', function() {
    // Elemente
    const startButton = document.getElementById('start-game');
    const tutorialButton = document.getElementById('tutorial-btn');
    const helpButton = document.getElementById('help-btn');
    const manualButton = document.getElementById('manual-btn');
    const mainMenu = document.getElementById('main-menu');
    const gameContent = document.getElementById('game-content');
    const tutorialContainer = document.getElementById('tutorial-container');
    const helpContainer = document.getElementById('help-container');
    const manualContainer = document.getElementById('manual-container');
    const closeButtons = document.querySelectorAll('.close-btn');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const tutorialContent = document.getElementById('tutorial-content');
    const helpContent = document.getElementById('help-content');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const kidsManualContent = document.getElementById('kids-manual');
    const parentsManualContent = document.getElementById('parents-manual');
    
    // Variablen
    let currentTutorialPage = 0;
    
    // Event-Listener
    startButton.addEventListener('click', showGameMenu);
    tutorialButton.addEventListener('click', showTutorial);
    helpButton.addEventListener('click', showHelp);
    manualButton.addEventListener('click', showManual);
    
    // Close-Buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.parentElement.style.display = 'none';
        });
    });
    
    // Tutorial-Navigation
    prevButton.addEventListener('click', showPreviousTutorialPage);
    nextButton.addEventListener('click', showNextTutorialPage);
    
    // Tab-Wechsel
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Aktiven Tab markieren
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Entsprechenden Inhalt anzeigen
            if (tab === 'kids') {
                kidsManualContent.style.display = 'block';
                parentsManualContent.style.display = 'none';
            } else {
                kidsManualContent.style.display = 'none';
                parentsManualContent.style.display = 'block';
            }
        });
    });
    
    // Handbuch-Inhalte laden
    kidsManualContent.innerHTML = kidsManual;
    parentsManualContent.innerHTML = parentsManual;
    
    // Funktionen
    function showGameMenu() {
        mainMenu.style.display = 'none';
        gameContent.style.display = 'block';
        
        // Spielmodule anzeigen
        let html = '<h2>Wähle ein Spiel</h2><div class="game-grid">';
        
        gameModules.forEach(module => {
            const stars = '⭐'.repeat(module.difficulty);
            html += `
                <div class="game-card" data-id="${module.id}">
                    <h3>${module.name}</h3>
                    <p>${module.description}</p>
                    <div class="difficulty">${stars}</div>
                </div>
            `;
        });
        
        html += '</div><button id="back-to-menu">Zurück zum Hauptmenü</button>';
        gameContent.innerHTML = html;
        
        // Event-Listener für Spielauswahl
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', function() {
                const gameId = this.getAttribute('data-id');
                startGame(gameId);
            });
        });
        
        // Zurück-Button
        document.getElementById('back-to-menu').addEventListener('click', function() {
            gameContent.style.display = 'none';
            mainMenu.style.display = 'flex';
        });
    }
    
    function startGame(gameId) {
        const game = gameModules.find(g => g.id === gameId);
        if (!game) return;
        
        // Hier würde die eigentliche Spiellogik starten
        gameContent.innerHTML = `
            <div class="game-header">
                <button id="back-to-games">Zurück zur Spielauswahl</button>
                <h2>${game.name}</h2>
                <button id="game-help">?</button>
            </div>
            <div class="game-area">
                <p>Das Spiel "${game.name}" wird hier angezeigt.</p>
                <p>Schwierigkeitsgrad: ${'⭐'.repeat(game.difficulty)}</p>
                <div class="placeholder-content">
                    <p>In diesem Spiel kannst du ${game.description.toLowerCase()}.</p>
                    <p>Folge den Anweisungen auf dem Bildschirm, um zu spielen!</p>
                </div>
            </div>
        `;
        
        // Event-Listener für Zurück-Button
        document.getElementById('back-to-games').addEventListener('click', showGameMenu);
        
        // Event-Listener für Hilfe-Button
        document.getElementById('game-help').addEventListener('click', function() {
            showGameHelp(gameId);
        });
    }
    
    function showTutorial() {
        currentTutorialPage = 0;
        updateTutorialContent();
        tutorialContainer.style.display = 'flex';
    }
    
    function updateTutorialContent() {
        const page = tutorialPages[currentTutorialPage];
        tutorialContent.innerHTML = `
            <h3>${page.title}</h3>
            ${page.content}
            <div class="page-indicator">Seite ${currentTutorialPage + 1} von ${tutorialPages.length}</div>
        `;
        
        // Button-Status aktualisieren
        prevButton.disabled = currentTutorialPage === 0;
        nextButton.textContent = currentTutorialPage === tutorialPages.length - 1 ? 'Fertig' : 'Weiter';
    }
    
    function showPreviousTutorialPage() {
        if (currentTutorialPage > 0) {
            currentTutorialPage--;
            updateTutorialContent();
        }
    }
    
    function showNextTutorialPage() {
        if (currentTutorialPage < tutorialPages.length - 1) {
            currentTutorialPage++;
            updateTutorialContent();
        } else {
            tutorialContainer.style.display = 'none';
        }
    }
    
    function showHelp() {
        helpContent.innerHTML = `
            <div class="help-section">
                <h3>Allgemeine Hilfe</h3>
                <p>Willkommen beim "Maya & Sophie: Der Fluch der Hexe Crunella" Lernspiel!</p>
                <p>So navigierst du durch das Spiel:</p>
                <ul>
                    <li>Klicke auf <strong>Spiel starten</strong>, um die verfügbaren Spiele zu sehen.</li>
                    <li>Wähle eines der 17 Spiele aus, indem du auf die Spielkarte klickst.</li>
                    <li>Folge den Anweisungen im Spiel, um zu lernen und Punkte zu sammeln.</li>
                    <li>Du kannst jederzeit zum Hauptmenü zurückkehren.</li>
                </ul>
                <p>Wenn du weitere Hilfe benötigst, klicke auf den Hilfe-Button (?) in jedem Spiel.</p>
            </div>
        `;
        helpContainer.style.display = 'flex';
    }
    
    function showGameHelp(gameId) {
        const game = gameModules.find(g => g.id === gameId);
        if (!game) return;
        
        helpContent.innerHTML = `
            <div class="help-section">
                <h3>Hilfe für ${game.name}</h3>
                <p>${game.description}</p>
                <h4>So spielst du:</h4>
                <ul>
                    <li>Folge den Anweisungen auf dem Bildschirm.</li>
                    <li>Nutze die Maus oder Tastatur, um zu spielen.</li>
                    <li>Sammle Punkte, indem du die Aufgaben richtig löst.</li>
                </ul>
                <h4>Tipps:</h4>
                <ul>
                    <li>Nimm dir Zeit und lies die Anweisungen sorgfältig durch.</li>
                    <li>Du kannst das Spiel jederzeit pausieren oder neu starten.</li>
                    <li>Frage Maya und Sophie um Rat, wenn du nicht weiterkommst.</li>
                </ul>
            </div>
        `;
        helpContainer.style.display = 'flex';
    }
    
    function showManual() {
        manualContainer.style.display = 'flex';
    }
});