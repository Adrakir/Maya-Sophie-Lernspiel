/**
 * ContentData.js
 * 
 * Verwaltet alle statischen Inhalte des Spiels wie Tagesgeschichten,
 * Lernbuchstaben und Spielinhalte. Dient als zentrale Datenquelle
 * für alle Module.
 */
const ContentData = {
    // Lernbuchstaben für jeden Tag, nach Schwierigkeitsgrad gruppiert
    dailyLetters: {
        'buchstabenentdecker': {
            1: ['M', 'A'],
            2: ['M', 'A'],
            3: ['M', 'A', 'L'],
            // Weitere Tage...
            35: ['Alle'] // Finale
        },
        'leseanfaenger': {
            1: ['M', 'A', 'L'],
            2: ['M', 'A', 'L', 'O'],
            3: ['M', 'A', 'L', 'O', 'S'],
            // Weitere Tage...
            35: ['Alle'] // Finale
        },
        'lesehase': {
            1: ['M', 'A', 'L', 'O'],
            2: ['M', 'A', 'L', 'O', 'S', 'R'],
            3: ['M', 'A', 'L', 'O', 'S', 'R', 'T'],
            // Weitere Tage...
            35: ['Alle'] // Finale
        }
    },
    
    // Tagesgeschichten
    dailyStories: {
        1: {
            title: "Der seltsame Brief",
            text: "Maja sitzt mit ihrer kleinen Schwester Sophie am Frühstückstisch. Plötzlich klingelt es an der Tür. Papa Sven öffnet. „Ein Brief für Maja!", ruft er. Maja nimmt den Brief. Er glitzert magisch. „Lies vor!", ruft Sophie aufgeregt. Maja öffnet den Brief. Sie kann schon einige Buchstaben erkennen: M und A – wie in ihrem Namen! Im Brief steht eine Warnung vor der bösen Hexe Crunella. Sie will verhindern, dass Mädchen lesen lernen! Denn durch Lesen können sie Magie entdecken. Die Hexe hat schon einen Plan: Sie will den kleinen Bruder Luca verzaubern!",
            image: "https://beispiel.de/images/day1.jpg"
        },
        2: {
            title: "Die Suche beginnt",
            text: "„Wir müssen Luca beschützen!", sagt Maja. „Wie denn?", fragt Sophie. Im Brief steht noch mehr: Sie müssen das alte Zauberbuch ihrer Uroma finden. „Aber dafür muss ich besser lesen können", sagt Maja. „Ich helfe dir!", ruft Sophie. Die Mädchen gehen auf den Dachboden. Dort finden sie eine alte Kiste. „Hier könnte das Buch sein", meint Maja. Doch die Kiste ist leer! Nur ein Zettel liegt darin. Darauf steht: „Die Hexe hat die Seiten des Buches im ganzen Haus versteckt. Findet sie, bevor es zu spät ist!"",
            image: "https://beispiel.de/images/day2.jpg"
        },
        // Weitere Tagesgeschichten...
        35: {
            title: "Der gebrochene Zauber",
            text: "Heute ist der große Tag! Majas 7. Geburtstag und die letzte Chance, Luca zu retten. Mit zitternden Händen schlägt Maja die letzte Seite des Zauberbuchs auf. „Ich kann den Zauberspruch lesen!", ruft sie stolz. Sophie und Luca halten ihre Hände. „Licht des Wissens, Kraft der Worte, breche Crunellas dunklen Bann!", liest Maja laut vor. Das Zimmer erstrahlt in buntem Licht! Plötzlich erscheint Crunella, wütend und machtlos. „Nein! Ein Mädchen, das lesen kann!", kreischt sie. Maja liest weiter: „Dein Zauber kehrt zu dir zurück!" Mit einem lauten Knall verwandelt sich Crunella in ein altes Schulheft. Luca lacht fröhlich und klatscht in die Hände. Die Gefahr ist vorüber! „Wir haben es geschafft!", jubelt Sophie. Maja lächelt: „Das Lesen hat uns gerettet." Und von diesem Tag an lasen die Schwestern jeden Abend zusammen – magische und ganz normale Geschichten.",
            image: "https://beispiel.de/images/day35.jpg"
        }
    },
    
    // Spielinhalte für die verschiedenen Spielmodule
    gameData: {
        // Alphabet Introduction Game
        alphabetIntroduction: {
            // Daten nach Tag und Schwierigkeitsgrad
            1: {
                'buchstabenentdecker': {
                    letters: ['M', 'A'],
                    words: ['Mama', 'Apfel'],
                    images: ['👩', '🍎']
                },
                'leseanfaenger': {
                    letters: ['M', 'A', 'L'],
                    words: ['Mama', 'Apfel', 'Lampe'],
                    images: ['👩', '🍎', '💡']
                },
                'lesehase': {
                    letters: ['M', 'A', 'L', 'O'],
                    words: ['Mama', 'Apfel', 'Lampe', 'Oma'],
                    images: ['👩', '🍎', '💡', '👵']
                }
            },
            // Weitere Tage...
        },
        
        // Letter Bingo Game
        letterBingo: {
            // Ähnliche Struktur wie oben, mit Wörtern und Bildern für das Bingo-Spiel
        },
        
        // Ähnliche Datenstrukturen für alle anderen Spiele...
    },
    
    // Interaktive Geschichten Daten
    interactiveStories: {
        1: {
            title: "Die geheimnisvolle Kiste",
            scenes: [
                {
                    id: "start",
                    text: "Maja und Sophie finden eine alte Kiste auf dem Dachboden. Was sollen sie tun?",
                    image: "kiste.jpg",
                    choices: [
                        { text: "Die Kiste öffnen", nextScene: "open_box" },
                        { text: "Papa rufen", nextScene: "call_dad" }
                    ]
                },
                {
                    id: "open_box",
                    text: "Maja öffnet vorsichtig die Kiste. Darin liegt ein altes, staubiges Buch mit dem Titel 'Zaubersprüche für Anfänger'.",
                    image: "buch.jpg",
                    choices: [
                        { text: "Das Buch nehmen", nextScene: "take_book" },
                        { text: "Das Buch liegen lassen", nextScene: "leave_book" }
                    ]
                },
                // Weitere Szenen...
            ],
            quiz: {
                question: "Was haben Maja und Sophie auf dem Dachboden gefunden?",
                options: ["Eine alte Kiste", "Ein Spielzeug", "Einen Brief", "Eine Katze"],
                correctAnswer: 0
            }
        },
        // Weitere interaktive Geschichten...
    },
    
    // Hilfsmethoden zum Abrufen von Inhalten
    getLettersForDay: function(day, difficulty) {
        return this.dailyLetters[difficulty][day] || [];
    },
    
    getStoryForDay: function(day) {
        return this.dailyStories[day] || null;
    },
    
    getGameDataForDay: function(day, gameType, difficulty) {
        if (this.gameData[gameType] && this.gameData[gameType][day]) {
            return this.gameData[gameType][day][difficulty] || this.gameData[gameType][day]['leseanfaenger'];
        }
        return null;
    },
    
    // Weitere Hilfsmethoden...
};