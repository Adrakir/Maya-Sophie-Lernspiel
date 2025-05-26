import React, { useState, useEffect } from 'react';
import './PhotoGallery.css';

// Platzhalterbilder und echte Bilder (als Simulation)
const placeholderImages = [
  { id: 1, src: 'https://via.placeholder.com/300x300/ffb6c1/000000?text=Maya', title: 'Maya', available: true },
  { id: 2, src: 'https://via.placeholder.com/300x300/ffb6c1/000000?text=Sophie', title: 'Sophie', available: true },
  { id: 3, src: 'https://via.placeholder.com/300x300/ffb6c1/000000?text=Maya+und+Sophie', title: 'Maya und Sophie', available: true },
  { id: 4, src: 'https://via.placeholder.com/300x300/cccccc/000000?text=Platzhalter', title: 'Spielzeit', available: false },
  { id: 5, src: 'https://via.placeholder.com/300x300/cccccc/000000?text=Platzhalter', title: 'Ausflug zum Park', available: false },
  { id: 6, src: 'https://via.placeholder.com/300x300/cccccc/000000?text=Platzhalter', title: 'Geburtstag', available: false },
  { id: 7, src: 'https://via.placeholder.com/300x300/cccccc/000000?text=Platzhalter', title: 'Picknick', available: false },
  { id: 8, src: 'https://via.placeholder.com/300x300/cccccc/000000?text=Platzhalter', title: 'Strandtag', available: false },
];

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'unavailable'

  useEffect(() => {
    // Simuliere das Laden von Fotos aus einer API
    setTimeout(() => {
      setPhotos(placeholderImages);
    }, 500);
  }, []);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  const filteredPhotos = () => {
    switch (filter) {
      case 'available':
        return photos.filter(photo => photo.available);
      case 'unavailable':
        return photos.filter(photo => !photo.available);
      default:
        return photos;
    }
  };

  // Simuliere das Hochladen eines neuen Fotos (nur UI, keine tatsächliche Funktion)
  const handleUpload = () => {
    alert('Diese Funktion wird in einer zukünftigen Version verfügbar sein. Danke für dein Interesse!');
  };

  return (
    <div className="photo-gallery">
      <h2>Fotogalerie</h2>
      <p className="gallery-description">
        Hier findest du alle Fotos von Maya und Sophie. Verfügbare Fotos kannst du anklicken,
        um sie in voller Größe anzusehen.
      </p>
      
      <div className="gallery-controls">
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            Alle Fotos
          </button>
          <button 
            className={filter === 'available' ? 'active' : ''} 
            onClick={() => setFilter('available')}
          >
            Verfügbare Fotos
          </button>
          <button 
            className={filter === 'unavailable' ? 'active' : ''} 
            onClick={() => setFilter('unavailable')}
          >
            Platzhalter
          </button>
        </div>
        
        <button className="upload-button" onClick={handleUpload}>
          <span className="upload-icon">+</span>
          Foto hochladen
        </button>
      </div>
      
      <div className="photos-container">
        {filteredPhotos().map(photo => (
          <div
            key={photo.id}
            className={`photo-card ${photo.available ? 'available' : 'unavailable'}`}
            onClick={() => photo.available && handlePhotoClick(photo)}
          >
            <div className="photo-image">
              <img src={photo.src} alt={photo.title} />
              {!photo.available && <div className="unavailable-overlay">Demnächst verfügbar</div>}
            </div>
            <div className="photo-info">
              <h3>{photo.title}</h3>
              <p>{photo.available ? 'Verfügbar' : 'Nicht verfügbar'}</p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedPhoto && (
        <div className="photo-modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>&times;</button>
            <img src={selectedPhoto.src} alt={selectedPhoto.title} />
            <h3>{selectedPhoto.title}</h3>
          </div>
        </div>
      )}
      
      <div className="gallery-help">
        <h3>Hinweis zur Fotogalerie:</h3>
        <p>Fotos mit einem grauen Hintergrund sind Platzhalter für zukünftige Bilder.</p>
        <p>Verfügbare Fotos können durch Anklicken vergrößert werden.</p>
        <p>In zukünftigen Updates kannst du eigene Fotos hochladen und teilen!</p>
      </div>
    </div>
  );
};

export default PhotoGallery;