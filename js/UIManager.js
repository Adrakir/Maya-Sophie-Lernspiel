/**
 * Zeigt das Benutzerhandbuch an
 * Enthält eine kinderfreundliche und eine Elternversion
 */
showUserManual: function() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';
    
    const manualContainer = document.createElement('div');
    manualContainer.className = 'manual-container';
    
    // Header mit Titel
    const header = document.createElement('div');
    header.className = 'manual-header';
    header.innerHTML = `
        <h1>Benutzerhandbuch</h1>
        <p>Maya & Sophie: Der Fluch der Hexe Crunella</p>
    `;
    manualContainer.appendChild(header);
    
    // Tabs für Kinder- und Eltern-Handbuch
    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    tabs.innerHTML = `
        <button id="tab-kids" class="tab-btn active">Für Kinder</button>
        <button id="tab-parents" class="tab-btn">Für Eltern</button>
    `;
    manualContainer.appendChild(tabs);
    
    // Container für Tab-Inhalte
    const contentContainer = document.createElement('div');
    contentContainer.className = 'tab-content-container';
    
    // Kinder-Handbuch
    const kidsContent = document.createElement('div');
    kidsContent.id = 'kids-content';
    kidsContent.className = 'manual-content';
    kidsContent.innerHTML = this.getKidsManualContent();
    contentContainer.appendChild(kidsContent);
    
    // Eltern-Handbuch (zunächst versteckt)
    const parentsContent = document.createElement('div');
    parentsContent.id = 'parents-content';
    parentsContent.className = 'manual-content';
    parentsContent.style.display = 'none';
    parentsContent.innerHTML = this.getParentsManualContent();
    contentContainer.appendChild(parentsContent);
    
    manualContainer.appendChild(contentContainer);
    
    // Zurück-Button
    const backButton = document.createElement('div');
    backButton.className = 'text-center mt-6';
    backButton.innerHTML = `
        <button id="back-to-game" class="kids-button">Zurück zum Spiel</button>
    `;
    manualContainer.appendChild(backButton);
    
    appContainer.appendChild(manualContainer);
    
    // Event-Listener für Tabs
    document.getElementById('tab-kids').addEventListener('click', () => {
        document.getElementById('kids-content').style.display = 'block';
        document.getElementById('parents-content').style.display = 'none';
        document.getElementById('tab-kids').classList.add('active');
        document.getElementById('tab-parents').classList.remove('active');
    });
    
    document.getElementById('tab-parents').addEventListener('click', () => {
        document.getElementById('kids-content').style.display = 'none';
        document.getElementById('parents-content').style.display = 'block';
        document.getElementById('tab-kids').classList.remove('active');
        document.getElementById('tab-parents').classList.add('active');
    });
    
    // Event-Listener für Zurück-Button
    document.getElementById('back-to-game').addEventListener('click', () => {
        if (GameManager.gameState.currentDay) {
            GameManager.showDayHub();
        } else {