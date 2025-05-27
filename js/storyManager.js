/**
 * Maya-Sophie Lernspiel - Story-Manager
 * Verwaltet alle Geschichten und interaktiven Inhalte
 */

class StoryManager {
    constructor() {
        this.stories = new Map();
        this.interactiveStories = new Map();
        this.currentStory = null;
        this.currentStoryPart = 0;
        this.storyData = null;
        
        console.log('📖 Story-Manager erstellt');
    }

    async loadStories() {
        try {
            // Basis-Geschichten laden
            await this.loadDailyStories();
            
            // Interaktive Geschichten laden
            await this.loadInteractiveStories();
            
            console.log(`📚 ${this.stories.size} Geschichten und ${this.interactiveStories.size} interaktive Geschichten geladen`);
            
        } catch (error) {
            console.error('Fehler beim Laden der Geschichten:', error);
            throw error;
        }
    }

    async loadDailyStories() {
        // Erweiterte Geschichten mit den neuen hinzufügen
        const extendedStories = {
            ...GameContent.stories,
            5: {
                title: "Tag 5: Der Riesen-Apfel und das Zwergen-Haus",
                chapter: "Kapitel 5: Große und kleine Überraschungen",
                image: "assets/images/stories/day5-apple.jpg",
                learningFocus: ["GR", "KL"],
                parts: [
                    {
                        type: "intro",
                        text: "Maja findet im Zauberbuch einen Spruch, um Obst und Gemüse größer wachsen zu lassen. Sie möchte einen riesigen Apfel für alle zum Teilen haben: 'Apfel, Apfel, groß und rund, wachse nun zu dieser Stund!'",
                        image: "assets/images/stories/day5-intro.jpg",
                        audio: "assets/audio/stories/day5-intro.mp3"
                    },
                    {
                        type: "main",
                        text: "Sie ist so aufgeregt, dass sie beim zweiten Teil des Spruchs, der sich auf ein nahegelegenes Spielzeughaus bezieht, versehentlich die Wörter vertauscht und liest: 'Häuschen, Häuschen, klein und Zwerg, schrumpfe nun zu dieser Stund!' Der Apfel auf dem Baum beginnt tatsächlich zu wachsen und wird riesig, fast so groß wie Luca selbst! Gleichzeitig aber schrumpft das Puppenhaus im Garten auf die Größe einer Streichholzschachtel.",
                        image: "assets/images/stories/day5-mishap.jpg",
                        audio: "assets/audio/stories/day5-main.mp3"
                    },
                    {
                        type: "outro",
                        text: "Luca versucht staunend, den Riesenapfel zu umarmen. Sophie bemerkt das winzige Puppenhaus und ruft: 'Maja, schau mal! Das Haus ist jetzt für Ameisen!' Sie kichern bei dem Gedanken, wie die Puppen darin wohl aussehen würden. Maja erkennt ihren Fehler und muss lachen. Sie korrigiert den Zauber für das Haus, woraufhin es wieder seine normale Größe annimmt. Den Riesenapfel teilen sie sich dann alle drei genüsslich – er reicht für den ganzen Nachmittag.",
                        image: "assets/images/stories/day5-outro.jpg",
                        audio: "assets/audio/stories/day5-outro.mp3"
                    }
                ],
                crunellaReactions: {
                    progress: "Crunella murrt: 'Große Äpfel, kleine Häuser... das ist doch kein richtiger Zauber!'",
                    success: "Crunella kocht vor Wut: 'Sie wird immer geschickter mit den Zaubern!'"
                },
                mishapType: "riesenApfel"
            },
            6: {
                title: "Tag 6: Der singende Staubsauger-Rüssel",
                chapter: "Kapitel 6: Musikalische Hausarbeit",
                image: "assets/images/stories/day6-vacuum.jpg",
                learningFocus: ["SCH", "SCHALL"],
                parts: [
                    {
                        type: "intro",
                        text: "Im Haus ist es etwas staubig. Maja möchte mit einem 'Blitz-Sauber-Spruch' helfen: 'Staub und Schmutz, verschwindet schnell, alles blitzeblank und hell!' Sie hält dabei den Staubsauger bereit.",
                        image: "assets/images/stories/day6-intro.jpg",
                        audio: "assets/audio/stories/day6-intro.mp3"
                    },
                    {
                        type: "main",
                        text: "Sie liest das Wort 'schnell' als 'Schall' und 'hell' als 'bell'. Anstatt dass der Staub verschwindet, fängt der Staubsaugerschlauch (der Rüssel) an, wie eine Operndiva mit tiefem 'Schall' zu singen und zwischendurch laut zu 'bellen' wie ein kleiner Hund. Er saugt dabei keinen einzigen Krümel auf, sondern bläst nur Luft heraus, die die Haare der Kinder durcheinanderwirbelt.",
                        image: "assets/images/stories/day6-mishap.jpg",
                        audio: "assets/audio/stories/day6-main.mp3"
                    },
                    {
                        type: "outro",
                        text: "Luca findet das tiefe Brummen und das plötzliche Bellen urkomisch und versucht, mit dem Staubsaugerschlauch zu tanzen. Sophie hält sich lachend den Bauch und meint, der Staubsauger hätte eine Gesangskarriere verdient. Maja kichert über den musikalischen Staubsauger, korrigiert dann aber den Spruch. Der Staubsauger wird wieder normal und saugt – wenn auch etwas widerwillig, wie Maja meint – den Staub auf.",
                        image: "assets/images/stories/day6-outro.jpg",
                        audio: "assets/audio/stories/day6-outro.mp3"
                    }
                ],
                crunellaReactions: {
                    progress: "Crunella lacht: 'Ein singender Staubsauger? Das ist ja lachhaft!'",
                    success: "Crunella schnaubt: 'Selbst ihre Missgeschicke werden immer kreativer!'"
                },
                mishapType: "singendeGeräte"
            },
            7: {
                title: "Tag 7: Die schwebenden Socken",
                chapter: "Kapitel 7: Das fliegende Sockensortier-Ballett",
                image: "assets/images/stories/day7-socks.jpg",
                learningFocus: ["PAAR", "SCHWARM"],
                parts: [
                    {
                        type: "intro",
                        text: "Es ist Wäschetag, und ein großer Berg Socken muss sortiert werden. Maja denkt, ein 'Ordnungs-Zauber' könnte helfen: 'Socken, Socken, Paar bei Paar, findet euch, ist doch klar!'",
                        image: "assets/images/stories/day7-intro.jpg",
                        audio: "assets/audio/stories/day7-intro.mp3"
                    },
                    {
                        type: "main",
                        text: "Sie liest das Wort 'Paar' aus Versehen als 'Schwarm' und 'klar' als 'schwebazar' (ein Fantasiewort, das wie 'schwebe da' klingt). Anstatt sich zu Paaren zu sortieren, erheben sich alle Socken wie ein bunter Schwarm in die Luft und beginnen, langsam und majestätisch durch das Zimmer zu schweben. Einige Socken bilden kleine Figuren oder Kreise in der Luft.",
                        image: "assets/images/stories/day7-mishap.jpg",
                        audio: "assets/audio/stories/day7-main.mp3"
                    },
                    {
                        type: "outro",
                        text: "Luca sitzt mitten im schwebenden Socken-Ballett und versucht, nach den bunten Socken zu greifen, die an ihm vorbeiziehen. Sophie ist begeistert und ruft: 'Das ist ja wie im Socken-Zirkus!' Sie tanzt unter den schwebenden Socken hindurch. Maja findet das Schauspiel selbst faszinierend, merkt aber, dass das Sortieren so nicht funktioniert. Mit einem Lachen liest sie den Spruch richtig. Die Socken landen sanft auf dem Boden, und das Sortieren geht dann doch von Hand weiter, aber mit viel Gekicher.",
                        image: "assets/images/stories/day7-outro.jpg",
                        audio: "assets/audio/stories/day7-outro.mp3"
                    }
                ],
                crunellaReactions: {
                    progress: "Crunella staunt: 'Fliegende Socken? Das habe ich ja noch nie gesehen!'",
                    success: "Crunella murmelt beeindruckt: 'Das war sogar... ziemlich hübsch anzusehen.'"
                },
                mishapType: "schwebendeGegenstände"
            },
            8: {
                title: "Tag 8: Der rückwärtssprechende Radio-Kobold",
                chapter: "Kapitel 8: Verkehrte Musik und verdrehte Töne",
                image: "assets/images/stories/day8-radio.jpg",
                learningFocus: ["RÜCKWÄRTS", "WIEDER"],
                parts: [
                    {
                        type: "intro",
                        text: "Die Kinder hören Kinderlieder im Radio. Maja möchte, dass ihr Lieblingslied noch einmal gespielt wird. Sie findet einen 'Wiederholungs-Spruch': 'Musik so schön, noch einmal her, spiel es wieder, bitte sehr!'",
                        image: "assets/images/stories/day8-intro.jpg",
                        audio: "assets/audio/stories/day8-intro.mp3"
                    },
                    {
                        type: "main",
                        text: "Sie verdreht die Wörter und liest 'Musik so sehr, spiel es her, rückwärts wieder, bitte schön!' Das Radio verstummt kurz, dann knackt es, und ein kleiner, lustiger Radio-Kobold (kaum größer als ein Daumen) springt aus dem Lautsprecher. Er beginnt, das Lieblingslied von Maja zu singen, aber komplett rückwärts! Die Wörter klingen wie Kauderwelsch, und seine Bewegungen sind auch spiegelverkehrt.",
                        image: "assets/images/stories/day8-mishap.jpg",
                        audio: "assets/audio/stories/day8-main.mp3"
                    },
                    {
                        type: "outro",
                        text: "Luca schaut den Kobold mit großen Augen an und versucht, die komischen Laute nachzumachen. Sophie kringelt sich vor Lachen über den rückwärts singenden und tanzenden Kobold. Sie versucht, rückwärts mitzusingen, was noch lustiger klingt. Maja prustet los vor Lachen. Als der Kobold sein Rückwärts-Lied beendet hat, verbeugt er sich tief (auch rückwärts) und springt mit einem 'Plöpp' wieder ins Radio. Maja beschließt, das Lied einfach normal nochmal anzumachen, aber die Erinnerung an den Radio-Kobold bringt alle noch lange zum Schmunzeln.",
                        image: "assets/images/stories/day8-outro.jpg",
                        audio: "assets/audio/stories/day8-outro.mp3"
                    }
                ],
                crunellaReactions: {
                    progress: "Crunella ist verwirrt: 'Rückwärts sprechen? Das ist ja völlig verrückt!'",
                    success: "Crunella schüttelt den Kopf: 'Diese Kinder finden Spaß an den seltsamsten Dingen!'"
                },
                mishapType: "rückwärtsSprechend"
            }
        };

        // Alle Geschichten in Map speichern
        Object.entries(extendedStories).forEach(([day, story]) => {
            this.stories.set(parseInt(day), story);
        });
    }

    async loadInteractiveStories() {
        // Neue interaktive Geschichten hinzufügen
        const newInteractiveStories = {
            kicherGarten: {
                title: "Das Kicher-Chaos im Garten",
                day: 9,
                scenes: {
                    garden_start: {
                        text: "Es ist ein sonniger Nachmittag. Mama bittet Maja, Sophie und Luca, im Garten beim Unkrautjäten zu helfen. Maja entdeckt im Zauberbuch einen Spruch: 'Unkraut klein, verschwinde fein, Blumen wachset sonnenschein!'",
                        image: "assets/images/interactive/garden-start.jpg",
                        audio: "assets/audio/interactive/garden-intro.mp3",
                        options: [
                            { text: "Spruch richtig lesen", target: "garden_correct", feedback: "Vorsichtig und konzentriert lesen!" },
                            { text: "Schnell lesen ohne nachzudenken", target: "garden_mishap", feedback: "Oh oh, das könnte schiefgehen..." }
                        ]
                    },
                    garden_mishap: {
                        text: "Maja liest schnell und vertauscht die Wörter: 'Blumen kichert kunterbunt hinein!' Das Unkraut verschwindet tatsächlich, aber alle Blumen im Garten fangen an, laut und ansteckend zu kichern! Die Rosen wiehern, die Tulpen glucksen und die Gänseblümchen kringeln sich vor Lachen.",
                        image: "assets/images/interactive/garden-laughing.jpg",
                        options: [
                            { text: "Mit den Blumen lachen", target: "garden_join_laughter", feedback: "Lachen ist ansteckend!" },
                            { text: "Schnell den Fehler korrigieren", target: "garden_correct_mistake", feedback: "Besonnen handeln ist gut!" }
                        ]
                    },
                    garden_join_laughter: {
                        text: "Luca, der im Gras sitzt, prustet los und lacht mit den Blumen um die Wette. Seine Freude scheint das Kichern der Blumen noch zu verstärken. Sophie versucht erst, die Blumen zu beruhigen, aber dann muss sie selbst so sehr lachen, dass ihr der Bauch wehtut. Das ganze Gartenchaos wird zu einem fröhlichen Lachanfall!",
                        image: "assets/images/interactive/garden-everyone-laughing.jpg",
                        options: [
                            { text: "Den Zauber korrigieren", target: "garden_happy_end" }
                        ]
                    },
                    garden_correct_mistake: {
                        text: "Maja findet schnell den Fehler im Buch und spricht den Spruch noch einmal richtig. Das Kichern hört auf, aber die Blumen sehen immer noch aus, als hätten sie Muskelkater vom Lachen.",
                        image: "assets/images/interactive/garden-fixed.jpg",
                        options: [
                            { text: "Weiter im Garten arbeiten", target: "garden_happy_end" }
                        ]
                    },
                    garden_happy_end: {
                        text: "Mama kommt in den Garten und wundert sich, warum alle so guter Laune sind und das Unkraut so schnell verschwunden ist. 'Ihr seid ja heute besonders fleißig!', sagt sie lächelnd. Die Kinder schauen sich an und müssen wieder kichern.",
                        image: "assets/images/interactive/garden-end.jpg",
                        options: [
                            { text: "Geschichte beenden", target: null }
                        ]
                    }
                }
            },
            fliegenderTisch: {
                title: "Der fliegende Frühstückstisch",
                day: 16,
                scenes: {
                    breakfast_start: {
                        text: "Morgens ist Papa Sven etwas spät dran. Maja möchte ihm helfen, den Frühstückstisch schnell zu decken und findet einen 'Herbeiruf-Zauber': 'Was ich brauch', komm schnell zur Hand, aus dem ganzen Haus und Land!'",
                        image: "assets/images/interactive/breakfast-start.jpg",
                        audio: "assets/audio/interactive/breakfast-intro.mp3",
                        options: [
                            { text: "Konzentriert lesen", target: "breakfast_correct", feedback: "Ruhe bewahren ist wichtig!" },
                            { text: "Im Eifer des Gefechts schnell lesen", target: "breakfast_mishap", feedback: "Hektik führt oft zu Fehlern..." }
                        ]
                    },
                    breakfast_mishap: {
                        text: "Im Eifer des Gefechts liest Maja 'zum Rand' statt 'zur Hand' und 'hoch vom Stand' statt 'Haus und Land'. Anstatt dass die Frühstückssachen auf dem Tisch erscheinen, beginnt der gesamte Frühstückstisch langsam zu schweben! Erst nur ein bisschen, dann immer höher, bis er fast an der Decke schwebt – mitsamt der noch leeren Teller und Tassen.",
                        image: "assets/images/interactive/breakfast-floating.jpg",
                        options: [
                            { text: "Papa Sven rufen", target: "breakfast_papa_comes", feedback: "Hilfe holen ist eine gute Idee!" },
                            { text: "Selbst versuchen zu reparieren", target: "breakfast_fix_attempt", feedback: "Eigeninitiative zeigen!" }
                        ]
                    },
                    breakfast_papa_comes: {
                        text: "Papa Sven kommt verschlafen in die Küche und traut seinen Augen nicht. 'Ist das etwa unser neuer Esszimmertisch für Riesen?', fragt er verwundert und reibt sich die Augen. Luca sitzt in seinem Hochstuhl und zeigt mit großen Augen auf den schwebenden Tisch: 'Da! Da!'",
                        image: "assets/images/interactive/breakfast-papa-confused.jpg",
                        options: [
                            { text: "Alles erklären", target: "breakfast_explanation" },
                            { text: "Schnell den Tisch reparieren", target: "breakfast_quick_fix" }
                        ]
                    },
                    breakfast_explanation: {
                        text: "Maja erklärt verlegen den Zauberspruch. Papa Sven lacht herzhaft: 'Na, dann lass uns mal schauen, wie wir den Tisch wieder runterbekommen. Ich hätte gerne meinen Kaffee am Boden, nicht in der Luft!' Sophie quietscht begeistert: 'Können wir nicht einmal im Fliegen frühstücken?'",
                        image: "assets/images/interactive/breakfast-family-laughing.jpg",
                        options: [
                            { text: "Gegen-Zauber finden", target: "breakfast_counter_spell" }
                        ]
                    },
                    breakfast_counter_spell: {
                        text: "Maja kramt hektisch im Buch und findet einen 'Sanft-Lande-Zauber'. Mit konzentrierter Stimme spricht sie: 'Was da schwebt, komm sanft herab, dass jeder seinen Platz nun hab!' Der Tisch senkt sich langsam und landet sicher auf dem Boden.",
                        image: "assets/images/interactive/breakfast-landing.jpg",
                        options: [
                            { text: "Endlich frühstücken!", target: "breakfast_happy_end" }
                        ]
                    },
                    breakfast_happy_end: {
                        text: "Alle setzen sich an den wieder normal stehenden Tisch. Der Appetit ist bei allen riesig nach dem aufregenden Morgen. 'Das war das spannendste Frühstück seit langem!', lacht Papa Sven und schenkt allen Kakao ein.",
                        image: "assets/images/interactive/breakfast-end.jpg",
                        options: [
                            { text: "Geschichte beenden", target: null }
                        ]
                    }
                }
            }
        };

        // Bestehende und neue interaktive Geschichten zusammenführen
        const allInteractiveStories = {
            ...GameContent.interactiveStories,
            ...newInteractiveStories
        };

        Object.entries(allInteractiveStories).forEach(([id, story]) => {
            this.interactiveStories.set(id, story);
        });
    }

    async loadDailyStory(day) {
        try {
            const story = this.stories.get(day);
            
            if (!story) {
                throw new Error(`Geschichte für Tag ${day} nicht gefunden`);
            }

            this.currentStory = day;
            this.currentStoryPart = 0;
            this.storyData = story;

            // Story-UI aktualisieren
            this.displayStoryPart();

            console.log(`📖 Geschichte für Tag ${day} geladen: ${story.title}`);
            
        } catch (error) {
            console.error('Fehler beim Laden der Geschichte:', error);
            throw error;
        }
    }

    displayStoryPart() {
        if (!this.storyData || !this.storyData.parts) return;

        const parts = this.storyData.parts;
        const currentPart = parts[this.currentStoryPart];
        
        if (!currentPart) return;

        // Story-Bild aktualisieren
        const storyImage = document.getElementById('storyImage');
        if (storyImage && currentPart.image) {
            storyImage.src = currentPart.image;
            storyImage.alt = `${this.storyData.title} - Teil ${this.currentStoryPart + 1}`;
        }

        // Story-Text aktualisieren
        const storyText = document.getElementById('storyText');
        if (storyText) {
            storyText.innerHTML = this.formatStoryText(currentPart.text);
        }

        // Navigation aktualisieren
        this.updateStoryNavigation();

        // Lernfokus anzeigen
        this.showLearningFocus();

        // Audio vorbereiten
        if (currentPart.audio) {
            this.prepareAudio(currentPart.audio);
        }

        // Mishap-Sound abspielen (falls vorhanden)
        if (currentPart.type === 'main' && this.storyData.mishapType) {
            setTimeout(() => {
                window.game?.audioManager?.playMishapSound(this.storyData.mishapType);
            }, 1000);
        }
    }

    formatStoryText(text) {
        // Text für bessere Darstellung formatieren
        return text
            .replace(/["„"]/g, '<span class="quote">"</span>')
            .replace(/['‚'']/g, '<span class="quote">\'</span>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    updateStoryNavigation() {
        const prevBtn = document.getElementById('prevStoryBtn');
        const nextBtn = document.getElementById('nextStoryBtn');
        const progressSpan = document.getElementById('storyProgress');

        if (prevBtn) {
            prevBtn.disabled = this.currentStoryPart === 0;
        }

        if (nextBtn) {
            const isLastPart = this.currentStoryPart >= this.storyData.parts.length - 1;
            nextBtn.disabled = isLastPart;
            nextBtn.textContent = isLastPart ? 'Fertig' : 'Weiter →';
        }

        if (progressSpan) {
            progressSpan.textContent = `${this.currentStoryPart + 1} / ${this.storyData.parts.length}`;
        }

        // Complete-Button anzeigen/verstecken
        const completeBtn = document.getElementById('completeStoryBtn');
        if (completeBtn)