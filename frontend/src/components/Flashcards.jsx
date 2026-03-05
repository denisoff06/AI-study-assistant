// Flashcards.jsx — Interactive flashcard viewer with flip animation

import { useState } from "react";

function Flashcards({ data, onNavigate }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!data || data.length === 0) return null;

  const total = data.length;
  const card = data[currentIndex];
  const progress = ((currentIndex + 1) / total) * 100;

  // Navigate to next card
  const goNext = () => {
    if (currentIndex < total - 1) {
      setFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 100);
    }
  };

  // Navigate to previous card
  const goPrev = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex - 1), 100);
    }
  };

  return (
    <div className="flashcards-section fade-in">
      <h2>Flashcards</h2>
      <p className="flashcard-counter">
        Card {currentIndex + 1} of {total}
      </p>

      {/* Progress bar */}
      <div className="progress-bar-bg" style={{ marginBottom: 20 }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Flashcard */}
      <div className="flashcard-wrapper" onClick={() => setFlipped(!flipped)}>
        <div className={`flashcard ${flipped ? "flipped" : ""}`}>
          {/* Front face — Question */}
          <div className="flashcard-face flashcard-front">
            <span className="flashcard-label">Question</span>
            <p className="flashcard-text">{card.front}</p>
            <span className="flashcard-hint">Tap to reveal answer</span>
          </div>
          {/* Back face — Answer */}
          <div className="flashcard-face flashcard-back">
            <span className="flashcard-label">Answer</span>
            <p className="flashcard-text">{card.back}</p>
            <span className="flashcard-hint">Tap to see question</span>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="nav-buttons">
        <button className="btn-secondary" onClick={() => onNavigate("study")}>
          Back
        </button>
        <button className="btn-secondary" onClick={goPrev} disabled={currentIndex === 0}>
          Prev
        </button>
        <button className="btn-secondary" onClick={goNext} disabled={currentIndex === total - 1}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Flashcards;
