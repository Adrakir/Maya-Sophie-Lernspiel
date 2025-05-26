import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HelpPage.css';

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  const faqs = [
    {
      question: "Wie kann ich ein Spiel starten?",
      answer: "Gehe zur Spieleseite über den 'Spiele' Button in der Navigation. Dort kannst du zwischen verschiedenen Spielen wie Tic Tac Toe, Memory und Puzzle wählen. Klicke einfach auf das Spiel, das du spielen möchtest."
    },
    {
      question: "Was sind die täglichen Lernspiele?",
      answer: "Die täglichen Lernspiele helfen Kindern, auf spielerische Weise zu lernen. Es gibt Spiele für Mathematik, das Alphabet und Farben. Du kannst sie über den 'Heute lernen' Button auf der Startseite oder über die Navigation erreichen."
    },
    {
      question: "Kann ich eigene Fotos hochladen?",
      answer: "Momentan kannst du die vorhandenen Fotos in der Galerie ansehen. Die Funktion zum Hochladen eigener Fotos wird in einer zukünftigen Version verfügbar sein."
    },
    {
      question: "Ist die App für alle Altersgruppen geeignet?",
      answer: "Maya & Sophie ist hauptsächlich für Kinder im Vorschul- und Grundschulalter (3-8 Jahre) konzipiert, kann aber auch von älteren Kindern verwendet werden."
    },
    {
      question: "Gibt es eine Möglichkeit, den Fortschritt zu speichern?",
      answer: "Aktuell werden Fortschritte nicht gespeichert. In zukünftigen Updates wird es möglich sein, ein Profil zu erstellen und Fortschritte zu verfolgen."
    }
  ];

  return (
    <div className="help-page">
      <h1 className="help-title">Hilfe & Information</h1>
      
      <div className="help-tabs">
        <button 
          className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
          onClick={() => setActiveTab('manual')}
        >
          Benutzerhandbuch
        </button>
        <button 
          className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          Häufige Fragen
        </button>
        <button 
          className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Kontakt
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'manual' && (
          <div className="manual-content">
            <h2>Benutzerhandbuch für Maya & Sophie</h2>
            
            <div className="manual-section">
              <h3>1. Einführung</h3>
              <p>Willkommen bei Maya & Sophie! Diese App bietet Kindern eine sichere und fröhliche Umgebung zum Spielen und Lernen. Von klassischen Spielen wie Tic Tac Toe bis hin zu lehrreichen Aktivitäten - hier ist für jedes Kind etwas dabei.</p>
            </div>
            
            <div className="manual-section">
              <h3>2. Startseite</h3>
              <p>Die Startseite bietet einen Überblick über alle verfügbaren Funktionen:</p>
              <ul>
                <li><strong>Spiele entdecken:</strong> Zugang zu allen Spielen</li>
                <li><strong>Heute lernen:</strong> Tägliche Lernspiele für Kinder</li>
                <li><strong>Entdecke unsere Welt:</strong> Übersicht über die verschiedenen Bereiche</li>
                <li><strong>Wusstest du schon?:</strong> Interessante Fakten für Kinder</li>
              </ul>
            </div>
            
            <div className="manual-section">
              <h3>3. Spiele</h3>
              <p>In der Spielesammlung findest du diese Spiele:</p>
              <ul>
                <li><strong>Tic Tac Toe:</strong> Das klassische Drei-in-einer-Reihe-Spiel</li>
                <li><strong>Memory:</strong> Finde passende Paare durch Umdrehen der Karten</li>
                <li><strong>Puzzle:</strong> Setze die Teile zusammen, um ein Bild zu vervollständigen</li>
              </ul>
              <p>Jedes Spiel hat kindgerechte Anleitungen und verschiedene Schwierigkeitsgrade.</p>
            </div>
            
            <div className="manual-section">
              <h3>4. Tägliches Lernen</h3>
              <p>Der Bereich "Tägliches Lernen" enthält lehrreiche Spiele:</p>
              <ul>
                <li><strong>Mathe-Spaß:</strong> Einfache Rechenaufgaben mit anpassbarem Schwierigkeitsgrad</li>
                <li><strong>ABC lernen:</strong> Buchstaben erkennen und Wörter zuordnen</li>
                <li><strong>Farben-Quiz:</strong> Farben erkennen und benennen lernen</li>
              </ul>
              <p>Bei richtigen Antworten gibt es motivierendes Feedback, bei falschen Antworten ermutigende Worte zum Weitermachen.</p>
            </div>
            
            <div className="manual-section">
              <h3>5. Fotogalerie</h3>
              <p>In der Fotogalerie kannst du:</p>
              <ul>
                <li>Vorhandene Fotos von Maya und Sophie ansehen</li>
                <li>Zwischen verschiedenen Kategorien wechseln (Alle Fotos, Verfügbare Fotos, Platzhalter)</li>
                <li>Auf ein Foto klicken, um es in voller Größe anzuzeigen</li>
              </ul>
              <p>In zukünftigen Versionen wird es möglich sein, eigene Fotos hochzuladen.</p>
            </div>
            
            <div className="manual-section">
              <h3>6. Tipps für Eltern</h3>
              <p>So können Sie Ihr Kind unterstützen:</p>
              <ul>
                <li>Beginnen Sie mit einfacheren Spielen und steigern Sie schrittweise den Schwierigkeitsgrad</li>
                <li>Loben Sie Ihr Kind für seine Bemühungen, nicht nur für richtige Antworten</li>
                <li>Spielen Sie gemeinsam, um den Lernprozess zu unterstützen</li>
                <li>Beschränken Sie die Bildschirmzeit auf angemessene Zeiträume</li>
                <li>Nutzen Sie die täglichen Lernspiele als Ergänzung zu anderen Lernaktivitäten</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'faq' && (
          <div className="faq-content" id="faq">
            <h2>Häufig gestellte Fragen</h2>
            
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                >
                  <div 
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3>{faq.question}</h3>
                    <span className="faq-toggle">{activeFaq === index ? '−' : '+'}</span>
                  </div>
                  
                  {activeFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="faq-not-found">
              <h3>Deine Frage ist nicht dabei?</h3>
              <p>Kontaktiere uns über den Kontaktbereich, und wir helfen dir gerne weiter!</p>
              <button 
                className="fancy-button"
                onClick={() => setActiveTab('contact')}
              >
                Zum Kontaktbereich
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div className="contact-content" id="contact">
            <h2>Kontakt</h2>
            
            <div className="contact-info">
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">✉️</div>
                  <h3>E-Mail</h3>
                  <p>kontakt@maya-sophie.de</p>
                </div>
                
                <div className="contact-method">
                  <div className="contact-icon">📞</div>
                  <h3>Telefon</h3>
                  <p>+49 123 456789</p>
                  <p className="hours">Mo-Fr: 9:00 - 17:00 Uhr</p>
                </div>
                
                <div className="contact-method">
                  <div className="contact-icon">🌐</div>
                  <h3>Website</h3>
                  <p>www.maya-sophie.de</p>
                </div>
              </div>
              
              <div className="contact-form">
                <h3>Nachricht senden</h3>
                <form>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="Dein Name" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" placeholder="Deine E-Mail-Adresse" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Nachricht</label>
                    <textarea id="message" rows="5" placeholder="Deine Nachricht an uns"></textarea>
                  </div>
                  
                  <button type="submit" className="fancy-button">
                    Nachricht senden
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpPage;