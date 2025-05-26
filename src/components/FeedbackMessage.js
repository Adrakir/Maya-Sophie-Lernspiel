import React, { useEffect, useState } from 'react';
import './FeedbackMessage.css';

const FeedbackMessage = ({ type, message }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Animation basierend auf dem Feedback-Typ
    if (type === 'correct') {
      setAnimationClass('feedback-bounce');
    } else {
      setAnimationClass('feedback-pulse');
    }
  }, [type]);

  return (
    <div className={`feedback-message ${type} ${animationClass}`}>
      <div className="feedback-content">
        {type === 'correct' && <span className="feedback-icon">✨</span>}
        {type === 'incorrect' && <span className="feedback-icon">💪</span>}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default FeedbackMessage;