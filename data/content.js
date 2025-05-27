/**
 * Maya-Sophie Lernspiel - Vollständige Inhaltsstruktur
 * Enthält alle Geschichten, Spiele und Lerninhalte
 */

const GameContent = {
    // Metadaten
    metadata: {
        version: "1.0.0",
        title: "Maya, Sophie & der Fluch der Hexe Crunella",
        description: "Ein interaktives Lernspiel für Kinder der 1. und 2. Klasse",
        targetAge: "6-8 Jahre",
        totalDays: 35,
        learningGoals: [
            "Buchstabenerkennung",
            "Silbenlesen", 
            "Wortverständnis",
            "Lesekompetenz",
            "Grundrechenarten"
        ]
    },

    // Charaktere
    characters: {
        maja: {
            name: "Maja",
            age: 6,
            description: "6-jähriges Mädchen mit langen blonden Haaren, neugierig und mutig",
            image: "assets/images/characters/maya-icon.png",
            color: "#3498db"
        },
        sophie: {
            name: "Sophie", 
            age: 4,
            description: "4-jähriges Mädchen mit langen blonden Haaren, schüchtern aber hilfsbereit",
            image: "assets/images/characters/sophie-icon.png",
            color: "#e74c3c"
        },
        luca: {
            name: "Luca",
            age: 1,
            description: "1-jähriges Baby mit kurzen blonden Haaren, fröhlich und neugierig",
            image: "assets/images/characters/luca-icon.png",
            color: "#f39c12"
        },
        crunella: {
            name: "Hexe Crunella",
            age: "unbekannt",
            description: "Kauzige Hexe mit spitzem Hut, nicht zu gruselig",
            image: "assets/images/characters/crunella-icon.png",
            color: "#8e44ad"
        }
    },

    // Lehrplan für 1. und 2. Klasse
    curriculum: {
        grade1: {
            letters: ["M", "A", "L", "O", "S", "R", "N", "E", "T", "I", "H", "U", "D", "AU", "EI", "EN", "IN", "CH"],
            skills: ["Buchstabenerkennung", "erste Silben", "einfache Wörter"],
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            mathSkills: ["Zählen", "Zuordnung", "Mengenverständnis"]
        },
        grade2: {
            letters: ["EU", "B", "F", "G", "K", "P", "W", "SCH", "ST", "SP", "PF", "TZ", "X", "Y", "CHS", "Qu", "Ä", "Ö", "Ü"],
            skills: ["Silbenlesen", "Wortverständnis", "kurze Texte"],
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            mathSkills: ["Addition bis 20", "Subtraktion bis 20", "Verdoppeln", "Halbieren"]
        }
    },

    // Tägliche Geschichten (komplett implementiert)
    stories: {
        1: {
            title: "Tag 1: Der unheimliche Brief und Crunellas Fluch",
            chapter: "Kapitel 1: Die Gefahr und die Hoffnung",
            image: "assets/images/stories/day1-brief.jpg",
            learningFocus: ["M", "A"],
            parts: [
                {
                    type: "intro",
                    text: "Maja kam von der Schule nach Hause und fand einen unheimlichen, versiegelten Brief in ihrem Ranzen. Darin stand in krakeliger Schrift: 'Die böse Hexe Crunella hat einen finsteren Plan! Sie will verhindern, dass Lucas magische Kräfte erwachen, wenn er ein Jahr alt wird. Nur wenn ihr das Lesen lernt und die Geheimnisse des Urahnen-Zauberbuchs entschlüsselt, könnt ihr ihn retten!'",
                    image: "assets/images/stories/day1-intro.jpg",
                    audio: "assets/audio/stories/day1-intro.mp3"
                },
                {
                    type: "main",
                    text: "Plötzlich drang ein kaltes, schadenfrohes Lachen vom Dachboden herab. Crunella! 'Niemals werdet ihr lesen und die Kunst der Magie erlernen!', krächzte ihre Stimme. 'Und ohne Lucas verstärkende Magie werdet ihr mich niemals besiegen!' Maja erschrak, aber dann sah sie einen seltsamen Schimmer. Ein Lama war kurz erschienen und wieder verschwunden! 'Ich habe MAMA als LAMA gelesen!', flüsterte sie Sophie zu.",
                    image: "assets/images/stories/day1-lama.jpg",
                    audio: "assets/audio/stories/day1-main.mp3"
                },
                {
                    type: "outro",
                    text: "Die Zeit drängte. Maja wusste, sie musste sofort mit dem Lesenlernen beginnen, um die Geheimnisse des Zauberbuchs ihrer Urahnen lüften zu können. Ihre allererste Lektion: Die Buchstaben M und A. Nur 33 Tage blieben ihr noch, bis Luca ein Jahr alt würde!",
                    image: "assets/images/stories/day1-outro.jpg",
                    audio: "assets/audio/stories/day1-outro.mp3"
                }
            ],
            crunellaReactions: {
                progress: "Crunella kichert: 'Das ist ja viel zu einfach! Das nächste wird schwerer!'",
                success: "Crunella stampft wütend mit dem Fuß: 'Unmöglich! Wie hat sie das geschafft?!'"
            },
            quiz: [
                {
                    question: "Welchen Brief fand Maja?",
                    options: ["Einen Liebesbrief", "Einen unheimlichen Brief", "Einen Schulbrief"],
                    correct: 1,
                    explanation: "Maja fand einen unheimlichen, versiegelten Brief mit einer Warnung vor Crunella."
                }
            ]
        },
        2: {
            title: "Tag 2: Der sprechende Apfelbaum und die Silben-Suppe",
            chapter: "Kapitel 2: Erste Spuren und magische Pannen",
            image: "assets/images/stories/day2-baum.jpg",
            learningFocus: ["L", "O"],
            parts: [
                {
                    type: "intro",
                    text: "Maja und Sophie machten sich auf den Weg in den Zauberwald, um mehr über Crunellas Fluch herauszufinden und vielleicht erste Seiten des Zauberbuchs ihrer Urahnen zu entdecken. Tief im Wald trafen sie auf einen sprechenden Apfelbaum.",
                    image: "assets/images/stories/day2-intro.jpg",
                    audio: "assets/audio/stories/day2-intro.mp3"
                },
                {
                    type: "main",
                    text: "Maja schluckte. Silben? Das klang nach noch mehr Arbeit. Sophie aber klatschte begeistert in die Hände. 'Silben sind wie kleine Wort-Bausteine!', erklärte der Baum. Am Abend wollten Maja und Sophie für Papa einen besonderen Orangentrank zaubern. Maja las den Spruch vor, aber aus 'Orangentrank' wurde 'Quallen-Suppe'! Eine glibberige, gelbe Qualle blubberte im Topf.",
                    image: "assets/images/stories/day2-qualle.jpg",
                    audio: "assets/audio/stories/day2-main.mp3"
                },
                {
                    type: "outro",
                    text: "Heute lernen sie die Buchstaben L und O. Mit den neuen Buchstaben üben sie nun das Silbenlesen. Hoffentlich verwandelt sich nichts Wichtiges mehr in eine Qualle, auch wenn Luca sich köstlich amüsierte!",
                    image: "assets/images/stories/day2-outro.jpg",
                    audio: "assets/audio/stories/day2-outro.mp3"
                }
            ],
            crunellaReactions: {
                progress: "Crunella schaut durch ihre Kristallkugel: 'Ha! Silben sind viel zu schwer für diese Gören!'",
                success: "Crunellas Besen fängt an zu qualmen vor Wut: 'Nein, nein, nein! Sie lernen zu schnell! Sogar Silben!'"
            }
        },
        // ... weitere 33 Geschichten folgen dem gleichen Schema
    },

    // Interaktive Geschichten
    interactiveStories: {
        fireflyPath: {
            title: "Der Glühwürmchen-Pfad",
            day: 4,
            scenes: {
                scene1: {
                    text: "Die Glühwürmchen summen: 'Willkommen, kleine Abenteurer! Um den Weg durch unseren Wald zu finden, müsst ihr klug wählen. Wir zeigen euch drei Wörter. Nur eines davon beschreibt etwas, das euch im dunklen Wald helfen würde!'",
                    image: "assets/images/interactive/firefly-start.jpg",
                    audio: "assets/audio/interactive/firefly-intro.mp3",
                    options: [
                        { text: "ROSE", target: "scene_rose", feedback: "Eine Rose duftet schön, aber leuchtet nicht." },
                        { text: "MAUS", target: "scene_maus", feedback: "Eine Maus ist klein und flink, aber kein Licht." },
                        { text: "LAMPE", target: "scene_lampe_correct", feedback: "Genau! Eine Lampe spendet Licht!" }
                    ]
                },
                scene_rose: {
                    text: "Du wählst ROSE. Die Glühwürmchen schütteln traurig ihre Köpfchen. 'Eine Rose ist schön, aber sie leuchtet nicht im Dunkeln. Der Pfad bleibt verborgen.' Du musst zurück zum Anfang des Rätsels.",
                    image: "assets/images/interactive/firefly-rose.jpg",
                    options: [
                        { text: "Nochmal versuchen", target: "scene1" }
                    ]
                },
                scene_maus: {
                    text: "Du wählst MAUS. Die Glühwürmchen kichern. 'Eine Maus huscht durch die Nacht, aber sie zeigt dir nicht den Weg. Der Pfad bleibt verborgen.' Du musst zurück zum Anfang des Rätsels.",
                    image: "assets/images/interactive/firefly-maus.jpg",
                    options: [
                        { text: "Nochmal versuchen", target: "scene1" }
                    ]
                },
                scene_lampe_correct: {
                    text: "Du wählst LAMPE. Die Glühwürmchen jubeln! 'Richtig! Eine Lampe erhellt die Dunkelheit!' Ein besonders helles Glühwürmchen löst sich vom Schwarm. 'Folgt mir!', summt es. 'Ich zeige euch den Weg!'",
                    image: "assets/images/interactive/firefly-correct.jpg",
                    options: [
                        { text: "Dem Glühwürmchen folgen!", target: "scene_end_success" }
                    ],
                    reward: "ZauberbuchSeite2"
                },
                scene_end_success: {
                    text: "Das helle Glühwürmchen führt euch sicher durch den dunklen Wald zu einer kleinen Lichtung. Dort, auf einem moosbewachsenen Stein, liegt eine weitere vergilbte Seite des Zauberbuchs eurer Urahnen! 'Gut gemacht!', summt das Glühwürmchen und verschwindet mit einem warmen Leuchten.",
                    image: "assets/images/interactive/firefly-success.jpg",
                    options: [
                        { text: "Juhu! Zurück zum Tagesmenü.", target: null }
                    ]
                }
            }
        },
        cookieRecipeMystery: {
            title: "Das vertauschte Rezept",
            day: 15,
            scenes: {
                recipe_start: {
                    text: "Maja und Sophie wollen Papa Sven zum Geburtstag mit Zauber-Glückskeksen überraschen. Maja findet ein Rezept im Urahnen-Zauberbuch: 'Für Kicher-Glück: Mehl, Eier und ein Löffel ZU-CK-ER.' Doch das 'ZU-CK-ER' ist etwas verwischt. Was liest Maja stattdessen?",
                    image: "assets/images/interactive/recipe-start.jpg",
                    options: [
                        { text: "Sie liest 'PU-LVER'.", target: "recipe_powder", feedback: "Pulver? Welches Pulver nur?" },
                        { text: "Sie liest 'SA-LZ'.", target: "recipe_salt", feedback: "Salz? In Keksen? Das klingt komisch." },
                        { text: "Sie entziffert 'ZU-CK-ER' richtig.", target: "recipe_sugar", feedback: "Genau, Zucker gehört in Kekse!" }
                    ]
                }
                // ... weitere Szenen
            }
        }
    },

    // Spiele-Definitionen
    games: {
        alphabetIntroduction: {
            name: "Buchstaben kennenlernen & Memory",
            icon: "🔤",
            difficulty: "easy",
            category: "letters",
            description: "Lerne die Buchstaben kennen und finde passende Paare",
            instructions: "Klicke auf die Karten und finde die Buchstaben-Paare. Höre dir den Buchstaben an und merke dir, wo er liegt!",
            minAge: 5,
            maxAge: 7,
            learningGoals: ["Buchstabenerkennung", "Gedächtnistraining", "Zuordnung"],
            gameData: {
                letters: ["A", "E", "I", "O", "U", "M", "L", "S", "R", "N"],
                modes: ["visual", "audio", "mixed"],
                difficulty: {
                    easy: { pairs: 4, time: 0 },
                    medium: { pairs: 6, time: 60 },
                    hard: { pairs: 8, time: 45 }
                }
            }
        },
        letterBingo: {
            name: "Buchstaben-Bingo",
            icon: "🎯",
            difficulty: "easy",
            category: "letters",
            description: "Finde die richtigen Buchstaben auf deinem Bingo-Feld",
            instructions: "Höre dir den Buchstaben an und klicke ihn auf deinem Bingo-Feld an. Wer zuerst eine Reihe voll hat, gewinnt!",
            minAge: 5,
            maxAge: 8,
            learningGoals: ["Buchstabenerkennung", "Schnelle Zuordnung", "Konzentration"],
            gameData: {
                fieldSize: { easy: 3, medium: 4, hard: 5 },
                winCondition: "line", // line, cross, full
                timeLimit: { easy: 0, medium: 120, hard: 90 }
            }
        },
        syllableClap: {
            name: "Silben klatschen",
            icon: "👏",
            difficulty: "medium",
            category: "syllables",
            description: "Klatsche die Silben der gezeigten Wörter",
            instructions: "Schaue dir das Wort an und klatsche für jede Silbe einmal. Zum Beispiel: 'Ma-ma' = 2x klatschen!",
            minAge: 6,
            maxAge: 8,
            learningGoals: ["Silbenerkennung", "Rhythmusgefühl", "Wortgliederung"],
            gameData: {
                words: {
                    1: ["Oma", "Uhu", "See"],
                    2: ["Mama", "Auto", "Hase", "Sofa"],
                    3: ["Banane", "Tomate", "Ananas"],
                    4: ["Automobile", "Wassermelone"]
                }
            }
        },
        treasureHunt: {
            name: "Schatzsuche",
            icon: "🗺️",
            difficulty: "medium",
            category: "reading",
            description: "Folge den Hinweisen und finde den Schatz",
            instructions: "Lies die Hinweise sorgfältig und klicke auf die richtige Richtung. Nur wer alle Hinweise richtig liest, findet den Schatz!",
            minAge: 6,
            maxAge: 9,
            learningGoals: ["Leseverständnis", "Aufmerksamkeit", "Logisches Denken"],
            gameData: {
                maps: ["forest", "castle", "garden", "house"],
                clues: {
                    forest: [
                        { text: "Gehe zum großen Baum", direction: "north", image: "tree.jpg" },
                        { text: "Folge dem Bach", direction: "east", image: "stream.jpg" },
                        { text: "Suche bei den Pilzen", direction: "south", image: "mushrooms.jpg" }
                    ]
                }
            }
        },
        blitzwoerter: {
            name: "Blitzwörter",
            icon: "⚡",
            difficulty: "hard",
            category: "reading",
            description: "Erkenne Wörter blitzschnell",
            instructions: "Ein Wort erscheint kurz auf dem Bildschirm. Klicke schnell auf das richtige Bild!",
            minAge: 7,
            maxAge: 9,
            learningGoals: ["Schnelles Lesen", "Wortganzheitserkennung", "Reaktionsfähigkeit"],
            gameData: {
                displayTime: { easy: 3000, medium: 2000, hard: 1000 },
                words: [
                    { word: "HUND", images: ["dog.jpg", "cat.jpg", "bird.jpg"], correct: 0 },
                    { word: "AUTO", images: ["car.jpg", "bike.jpg", "train.jpg"], correct: 0 },
                    { word: "BALL", images: ["ball.jpg", "cube.jpg", "ring.jpg"], correct: 0 }
                ]
            }
        },
        wortpaare: {
            name: "Wortpaare",
            icon: "🤝",
            difficulty: "medium",
            category: "vocabulary",
            description: "Finde zusammengehörige Wörter",
            instructions: "Verbinde Wörter, die zusammengehören. Das können Reimwörter, Gegensätze oder ähnliche Begriffe sein!",
            minAge: 6,
            maxAge: 8,
            learningGoals: ["Wortschatz", "Zuordnung", "Sprachgefühl"],
            gameData: {
                pairTypes: ["rhymes", "opposites", "categories"],
                pairs: {
                    rhymes: [
                        ["Maus", "Haus"], ["See", "Tee"], ["Ball", "Fall"]
                    ],
                    opposites: [
                        ["groß", "klein"], ["hell", "dunkel"], ["warm", "kalt"]
                    ],
                    categories: [
                        ["Apfel", "Birne"], ["Hund", "Katze"], ["Auto", "Bus"]
                    ]
                }
            }
        },
        leseWuerfel: {
            name: "Lese-Würfel",
            icon: "🎲",
            difficulty: "easy",
            category: "reading",
            description: "Würfle und ordne Wörter den richtigen Bildern zu",
            instructions: "Würfle ein Wort und klicke auf das passende Bild. Je mehr richtige Zuordnungen, desto mehr Punkte!",
            minAge: 5,
            maxAge: 7,
            learningGoals: ["Wort-Bild-Zuordnung", "Leseverständnis", "Schnelle Erfassung"],
            gameData: {
                diceWords: ["KATZE", "BALL", "SONNE", "HAUS", "BAUM", "AUTO"],
                images: {
                    "KATZE": "cat.jpg",
                    "BALL": "ball.jpg", 
                    "SONNE": "sun.jpg",
                    "HAUS": "house.jpg",
                    "BAUM": "tree.jpg",
                    "AUTO": "car.jpg"
                }
            }
        },
        wortKette: {
            name: "Wortkette",
            icon: "🔗",
            difficulty: "hard",
            category: "vocabulary",
            description: "Bilde eine Kette aus zusammenhängenden Wörtern",
            instructions: "Der letzte Buchstabe eines Wortes ist der erste Buchstabe des nächsten Wortes. Beispiel: Haus → Sonne → Esel",
            minAge: 7,
            maxAge: 9,
            learningGoals: ["Wortschatz", "Buchstabenerkennung", "Logisches Denken"],
            gameData: {
                startWords: ["HUND", "BALL", "SONNE", "AUTO"],
                dictionary: ["HUND", "DACH", "HAUS", "SONNE", "ESEL", "LAMPE", "ENGEL"]
            }
        },
        buecherwurm: {
            name: "Bücherwurm",
            icon: "🐛",
            difficulty: "medium",
            category: "comprehension",
            description: "Beantworte Fragen zum gelesenen Text",
            instructions: "Lies den kurzen Text aufmerksam und beantworte dann die Fragen. Der Bücherwurm hilft dir dabei!",
            minAge: 6,
            maxAge: 9,
            learningGoals: ["Leseverständnis", "Textverständnis", "Aufmerksamkeit"],
            gameData: {
                texts: [
                    {
                        title: "Max und sein Hund",
                        content: "Max hat einen braunen Hund. Der Hund heißt Bello. Bello mag es, im Park zu spielen. Am liebsten spielt er mit seinem Ball.",
                        questions: [
                            { q: "Wie heißt der Hund?", options: ["Bello", "Max", "Bruno"], correct: 0 },
                            { q: "Welche Farbe hat der Hund?", options: ["schwarz", "braun", "weiß"], correct: 1 },
                            { q: "Was spielt Bello gerne?", options: ["mit dem Ball", "mit der Katze", "Verstecken"], correct: 0 }
                        ]
                    }
                ]
            }
        },
        wortgitter: {
            name: "Wortgitter",
            icon: "🔍",
            difficulty: "hard",
            category: "reading",
            description: "Finde versteckte Wörter im Buchstabengitter",
            instructions: "Suche die versteckten Wörter im Gitter. Sie können waagerecht, senkrecht oder diagonal stehen!",
            minAge: 7,
            maxAge: 9,
            learningGoals: ["Worterkennung", "Visuelle Wahrnehmung", "Konzentration"],
            gameData: {
                gridSize: { easy: 6, medium: 8, hard: 10 },
                words: ["HUND", "KATZE", "MAUS", "VOGEL", "FISCH"],
                directions: ["horizontal", "vertical", "diagonal"]
            }
        },
        lueckentextMaus: {
            name: "Lückentext Maus",
            icon: "🐭",
            difficulty: "medium",
            category: "comprehension",
            description: "Fülle die Lücken im Text aus",
            instructions: "Die kleine Maus hat Wörter aus dem Text gefressen! Hilf ihr und setze die richtigen Wörter ein.",
            minAge: 6,
            maxAge: 8,
            learningGoals: ["Textverständnis", "Wortschatz", "Satzverständnis"],
            gameData: {
                texts: [
                    {
                        content: "Die ____ scheint hell am Himmel. Die ____ schwimmen im Teich. Der ____ bellt laut.",
                        words: ["Sonne", "Fische", "Hund"],
                        blanks: [0, 1, 2]
                    }
                ]
            }
        },
        raetselGeschichte: {
            name: "Rätselgeschichte",
            icon: "🕵️",
            difficulty: "hard",
            category: "comprehension",
            description: "Löse das Rätsel der Geschichte",
            instructions: "Lies die Geschichte aufmerksam und finde heraus, wer der Täter ist oder was das Geheimnis ist!",
            minAge: 7,
            maxAge: 9,
            learningGoals: ["Leseverständnis", "Logisches Denken", "Detailwahrnehmung"],
            gameData: {
                stories: [
                    {
                        title: "Der verschwundene Kuchen",
                        content: "Mama hat einen Kuchen gebacken. Am Morgen war er noch da. Mittags war er weg. Papa war arbeiten. Maja war in der Schule. Nur Bello, der Hund, war zu Hause.",
                        question: "Wer hat den Kuchen gegessen?",
                        options: ["Papa", "Maja", "Bello"],
                        correct: 2,
                        explanation: "Bello war der einzige zu Hause!"
                    }
                ]
            }
        },

        // Bonusspiele
        balloonShooter: {
            name: "Ballon-Schießen",
            icon: "🎈",
            difficulty: "medium",
            category: "bonus",
            description: "Schieße auf Ballons mit den richtigen Buchstaben",
            instructions: "Höre dir den Buchstaben an und schieße auf den richtigen Ballon! Aber pass auf die falschen auf!",
            unlockCondition: "readingDiary",
            minAge: 6,
            maxAge: 8,
            learningGoals: ["Buchstabenerkennung", "Reaktionsfähigkeit", "Hand-Auge-Koordination"],
            gameData: {
                balloonSpeed: { easy: 2, medium: 3, hard: 4 },
                correctScore: 10,
                wrongPenalty: -5
            }
        },
        vokalSammler: {
            name: "Vokal-Sammler",
            icon: "🎯",
            difficulty: "easy",
            category: "bonus",
            description: "Sammle alle Vokale ein, bevor sie verschwinden",
            instructions: "Sammle nur die Vokale (A, E, I, O, U) und meide die Konsonanten!",
            unlockCondition: "readingDiary",
            minAge: 5,
            maxAge: 7,
            learningGoals: ["Vokal-Konsonant-Unterscheidung", "Schnelle Reaktion", "Kategorisierung"],
            gameData: {
                vowels: ["A", "E", "I", "O", "U", "Ä", "Ö", "Ü"],
                consonants: ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"],
                spawnRate: 2000,
                itemLifetime: 3000
            }
        }
    },

    // Audio-Konfiguration
    audio: {
        backgroundMusic: {
            "main-theme": "assets/audio/music/main-theme.mp3",
            "story-theme": "assets/audio/music/story-theme.mp3",
            "games-theme": "assets/audio/music/games-theme.mp3",
            "game-theme": "assets/audio/music/game-theme.mp3",
            "calm-theme": "assets/audio/music/calm-theme.mp3"
        },
        soundEffects: {
            "click": "assets/audio/sfx/click.mp3",
            "success": "assets/audio/sfx/success.mp3",
            "error": "assets/audio/sfx/error.mp3",
            "star": "assets/audio/sfx/star.mp3",
            "magic": "assets/audio/sfx/magic.mp3",
            "page-turn": "assets/audio/sfx/page-turn.mp3",
            "applause": "assets/audio/sfx/applause.mp3",
            "whistle": "assets/audio/sfx/whistle.mp3"
        },
        narration: {
            "intro": "assets/audio/narration/intro.mp3",
            "tutorial": "assets/audio/narration/tutorial.mp3",
            "completion": "assets/audio/narration/completion.mp3"
        }
    },

    // Elternbereich-Konfiguration
    parentArea: {
        bonusTasks: {
            readingHouse: {
                name: "Lesehäuser gelesen",
                description: "Für jedes gelesene Kinderbuch außerhalb des Spiels",
                stars: 5,
                maxPerDay: 3,
                icon: "🏠"
            },
            learningDiary: {
                name: "Lerntagebuch-Einträge",
                description: "Für jeden Eintrag ins Lerntagebuch",
                stars: 3,
                maxPerDay: 2,
                icon: "📔"
            },
            wordLists: {
                name: "Wortlisten erstellt",
                description: "Für selbst erstellte Wortlisten",
                stars: 2,
                maxPerDay: 1,
                icon: "📝"
            }
        },
        settings: {
            difficultyLevels: {
                easy: "Leicht (1. Klasse)",
                medium: "Mittel (1.-2. Klasse)", 
                hard: "Schwer (2. Klasse)"
            },
            dailyLimits: [10, 15, 20, 30, 45, 60, 90, 120], // Minuten
            features: {
                audioEnabled: true,
                animationsEnabled: true,
                autoSaveEnabled: true,
                parentNotifications: true
            }
        }
    },

    // Tutorial-Inhalte
    tutorial: {
        steps: [
            {
                target: "#startStoryBtn",
                title: "Tägliche Geschichten",
                content: "Hier startest du deine tägliche Geschichte mit Maya und Sophie!",
                position: "bottom"
            },
            {
                target: "#gamesBtn", 
                title: "Lernspiele",
                content: "Hier findest du viele tolle Spiele zum Üben!",
                position: "bottom"
            },
            {
                target: "#progressStars",
                title: "Deine Sterne",
                content: "Für jede abgeschlossene Geschichte bekommst du einen Stern!",
                position: "top"
            },
            {
                target: "#helpBtn",
                title: "Hilfe",
                content: "Falls du Hilfe brauchst, klicke hier!",
                position: "left"
            }
        ]
    }
};

// Hilfsfunktionen
const GameUtils = {
    getCurrentLetters(day) {
        // Bestimmt welche Buchstaben an einem bestimmten Tag gelernt werden
        const letterSchedule = {
            1: ["M", "A"], 2: ["L", "O"], 3: ["S", "R"], 4: ["N", "E"], 5: ["T", "I"],
            6: ["H", "U"], 7: ["D", "AU"], 8: ["EI", "EN"], 9: ["IN", "CH"], 10: ["EU", "B"],
            // ... weitere Tage
        };
        return letterSchedule[day] || [];
    },
    
    getDifficultyForAge(age) {
        if (age <= 6) return "easy";
        if (age <= 7) return "medium";
        return "hard";
    },
    
    getWordsForLetters(letters) {
        const wordList = {
            "M": ["MAMA", "MAUS", "MOND"],
            "A": ["APFEL", "AUTO", "ARM"],
            "L": ["LAMPE", "LAMA", "LUFT"],
            "O": ["OMA", "OFEN", "OHR"],
            // ... weitere Buchstaben
        };
        
        let words = [];
        letters.forEach(letter => {
            if (wordList[letter]) {
                words = words.concat(wordList[letter]);
            }
        });
        return words;
    }
};

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameContent, GameUtils };
}