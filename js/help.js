// Hilfe-System für Maya & Sophie Lernspiel

// Hilfe-Daten für alle Spielmodule
const helpData = {
    'AlphabetIntroduction': {
        title: "Alphabeteinführung",
        content: `
            <div class="help-section">
                <h3>Wie man spielt:</h3>
                <p>In diesem Spiel lernst du das Alphabet kennen!</p>
                <p>Klicke auf einen Buchstaben, um seinen Laut zu hören.</p>
                <p>Du kannst auch auf die Bilder klicken, um Wörter zu hören, die mit dem Buchstaben beginnen.</p>
                
                <h3>Tipps:</h3>
                <ul>
                    <li>Höre dir jeden Buchstaben mehrmals an.</li>
                    <li>Versuche, den Laut nachzusprechen.</li>
                    <li>Schau dir die Bilder genau an und merke dir, welche Wörter mit welchem Buchstaben beginnen.</li>
                </ul>
            </div>
        `
    },
    'LetterBingo': {
        title: "Buchstaben-Bingo",
        content: `
            <div class="help-section">
                <h3>Wie man spielt:</h3>
                <p>Buchstaben-Bingo ist ein lustiges Spiel, um Buchstaben zu erkennen!</p>
                <p>Auf deiner Bingo-Karte siehst du verschiedene Buchstaben.</p>
                <p>Maya oder Sophie zeigen dir einen Buchstaben. Findest du ihn auf deiner Karte? Dann klicke ihn an!</p>
                <p>Wenn du eine Reihe vollständig hast - horizontal, vertikal oder diagonal - hast du Bingo!</p>
                
                <h3>Tipps:</h3>
                <ul>
                    <li>Schau dir deine Bingo-Karte genau an, bevor du beginnst.</li>
                    <li>Achte auf die Form der Buchstaben. Manche sehen ähnlich aus!</li>
                    <li>Je schneller du die Buchstaben findest, desto mehr Punkte bekommst du.</li>
                </ul>
            </div>
        `
    },
    // Weitere Hilfe-Daten für alle anderen Spielmodule...
};

// Hilfe anzeigen
function showHelp(gameModule) {
    const helpContainer = document.getElementById('help-container');
    const helpContent = document.querySelector('.help-content');
    const closeButton = helpContainer.querySelector('.close-button');
    
    // Standard-Hilfe, wenn kein Spielmodul angegeben ist
    if (!gameModule || !helpData[gameModule]) {
        helpContainer.querySelector('h2').textContent = "Allgemeine Hilfe";
        helpContent.innerHTML = `
            <div class="help-section">
                <h3>Spielauswahl:</h3>
                <p>Wähle eines der 17 Spielmodule aus dem Hauptmenü.</p>
                
                <h3>Navigation:</h3>
                <p>Klicke auf den Zurück-Button, um zum Hauptmenü zurückzukehren.</p>
                <p>Klicke auf den Hilfe-Button (?), um diese Hilfe anzuzeigen.</p>
                
                <h3>Einstellungen:</h3>
                <p>Im Einstellungsmenü kannst du die Lautstärke anpassen und andere Optionen ändern.</p>
            </div>
        `;
    } else {
        // Modulspezifische Hilfe
        const help = helpData[gameModule];
        helpContainer.querySelector('h2').textContent = help.title;
        helpContent.innerHTML = help.content;
    }
    
    // Event-Listener für Close-Button
    closeButton.addEventListener('click', () => {
        helpContainer.style.display = 'none';
    });
    
    // Hilfe anzeigen
    helpContainer.style.display = 'block';
}