# Mitwirken am Projekt "Maya & Sophie: Der Fluch der Hexe Crunella"

Vielen Dank für Ihr Interesse, zum Maya & Sophie Lernspiel beizutragen! Dieses Dokument enthält Richtlinien und technische Informationen für Mitwirkende.

## Technische Umsetzung

### Architektur

Das Projekt folgt einer modularen Architektur mit folgenden Kernkomponenten:

1. **GameManager**: Zentrale Steuereinheit, die den Spielzustand verwaltet und den Spielfluss koordiniert
2. **UIManager**: Verantwortlich für alle Benutzeroberflächen-Elemente und DOM-Manipulationen
3. **ContentData**: Enthält alle statischen Inhalte wie Geschichten, Wortlisten und Spieledaten
4. **SaveLoadManager**: Behandelt das Speichern und Laden des Spielstands via localStorage
5. **AudioManager**: Steuert alle audiobezogenen Funktionen einschließlich der Sprachausgabe
6. **Spielmodule**: Separate Module für jedes Lernspiel mit einheitlicher Schnittstelle

### Wichtige Schnittstellen

Jedes Spielmodul muss folgende Methoden implementieren:

```javascript
{
    init: function(gameData, onGameEnd) { ... },      // Initialisierung des Spiels
    render: function() { ... },                       // Darstellung des Spiels
    handleInteraction: function(type, data) { ... },  // Behandlung von Benutzerinteraktionen
    cleanup: function() { ... }                       // Aufräumen vor Spielende
}