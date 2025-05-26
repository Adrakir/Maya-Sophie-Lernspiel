import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import GamesPage from './components/GamesPage';
import PhotoGallery from './components/PhotoGallery';
import HelpPage from './components/HelpPage';
import DailyLearningGames from './components/DailyLearningGames';
import ReadingLearning from './components/ReadingLearning';
import Footer from './components/Footer';
import './App.css';

/**
 * Hauptkomponente der Anwendung
 * Verwaltet das Routing zu allen Hauptseiten
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/reading" element={<ReadingLearning />} />
            <Route path="/photos" element={<PhotoGallery />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/daily-learning" element={<DailyLearningGames />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;