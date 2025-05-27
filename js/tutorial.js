// Tutorial-System für Maya & Sophie Lernspiel

// Tutorial-Daten
const tutorialData = [
    {
        title: "Willkommen bei Maya & Sophie!",
        content: `
            <div class="tutorial-page">
                <img src="assets/images/tutorial/welcome.png" alt="Willkommen" class="tutorial-image">
                <p>Hallo! Wir sind Maya und Sophie. Wir werden dir bei deinem Lern-Abenteuer helfen!</p>
                <p>In diesem Spiel wirst du viele spannende Spiele entdecken, die dir beim Lesen und Schreiben helfen.</p>
            </div>
        `
    },
    {
        title: "Das Hauptmenü",
        content: `
            <div class="tutorial-page">
                <img src="assets/images/tutorial/main_menu.png" alt="Hauptmenü" class="tutorial-image">
                <p>Im Hauptmenü kannst du verschiedene Spiele auswählen.</p>
                <p>Klicke einfach auf ein Spiel, um es zu starten!</p>
            </div>
        `
    },
    {
        title: "Die Spielmodule",
        content: `
            <div class="tutorial-page">
                <img src="assets/images/tutorial/modules.png" alt="Spielmodule" class="tutorial-image">
                <p>Es gibt 17 verschiedene Spielmodule:</p>
                <ul>
                    <li>Alphabeteinführung</li>
                    <li>Buchstaben-Bingo</li>
                    <li>Silbenklatschen</li>
                    <li>Und viele mehr!</li>
                </ul>
            </div>
        `
    },
    {
        title: "Hilfe bekommen",
        content: `
            <div class="tutorial-page">
                <img src="assets/images/tutorial/help.png" alt="Hilfe" class="tutorial-image">
                <p>Brauchst du Hilfe? Klicke einfach auf den Hilfe-Button (?) in jedem Spiel.</p>
                <p>Maya und Sophie werden dir erklären, wie du spielen kannst!</p>
            </div>
        `
    },
    {
        title: "Viel Spaß!",
        content: `
            <div class="tutorial-page">
                <img src="assets/images/tutorial/fun.png" alt="Viel Spaß" class="tutorial-image">
                <p>Wir wünschen dir viel Spaß beim Spielen und Lernen!</p>
                <p>Lass uns jetzt loslegen!</p>
            </div>
        `
    }
];

// Tutorial initialisieren
function initTutorial() {
    const tutorialContainer = document.getElementById('tutorial-container');
    const tutorialContent = document.querySelector('.tutorial-content');
    const prevButton = document.getElementById('prev-tutorial');
    const nextButton = document.getElementById('next-tutorial');
    const closeButton = tutorialContainer.querySelector('.close-button');
    
    let currentPage = 0;
    
    // Tutorial-Inhalte aktualisieren
    function updateTutorialContent() {
        const tutorial = tutorialData[currentPage];
        tutorialContainer.querySelector('h2').textContent = tutorial.title;
        tutorialContent.innerHTML = tutorial.content;
        
        // Button-Status aktualisieren
        prevButton.disabled = currentPage === 0;
        nextButton.textContent = currentPage === tutorialData.length - 1 ? "Fertig" : "Weiter";
    }
    
    // Event-Listener für Navigation
    prevButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateTutorialContent();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentPage < tutorialData.length - 1) {
            currentPage++;
            updateTutorialContent();
        } else {
            // Tutorial beenden
            tutorialContainer.style.display = 'none';
        }
    });
    
    closeButton.addEventListener('click', () => {
        tutorialContainer.style.display = 'none';
    });
    
    // Initialer Aufruf
    updateTutorialContent();
}

// Tutorial starten
function startTutorial() {
    const tutorialContainer = document.getElementById('tutorial-container');
    tutorialContainer.style.display = 'block';
}