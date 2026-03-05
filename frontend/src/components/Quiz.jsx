// Quiz.jsx — Interactive multiple-choice quiz with scoring

import { useState } from "react";

function Quiz({ data, onNavigate }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answered, setAnswered] = useState(false);

  if (!data || data.length === 0) return null;

  const total = data.length;
  const question = data[currentQ];
  const progress = ((currentQ + 1) / total) * 100;

  // Handle selecting an answer
  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === question.correct_answer) {
      setScore(score + 1);
    }
  };

  // Move to next question or show results
  const handleNext = () => {
    if (currentQ < total - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  // Retake the quiz
  const handleRetake = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setShowResults(false);
    setAnswered(false);
  };

  // Get styling class for each option
  const getOptionClass = (option) => {
    if (!answered) return "quiz-option";
    if (option === question.correct_answer) return "quiz-option correct";
    if (option === selected && option !== question.correct_answer) return "quiz-option wrong";
    return "quiz-option";
  };

  // Results screen
  if (showResults) {
    const percentage = Math.round((score / total) * 100);
    let message = "Keep studying, you'll get there!";
    if (percentage >= 80) message = "Excellent work! You really know this material!";
    else if (percentage >= 60) message = "Good job! A bit more review and you'll ace it!";

    return (
      <div className="quiz-section fade-in">
        <div className="card quiz-results">
          <div className="score">
            {score}/{total}
          </div>
          <h3>
            {percentage >= 80 ? "Great job!" : percentage >= 60 ? "Good effort!" : "Keep going!"}
          </h3>
          <p>{message}</p>
          <button className="btn-primary" onClick={handleRetake}>
            Retake Quiz
          </button>
          <div className="nav-buttons" style={{ marginTop: 12 }}>
            <button className="btn-secondary" onClick={() => onNavigate("study")}>
              Back to Summary
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-section fade-in">
      <h2>Quiz</h2>
      <p className="quiz-counter">
        Question {currentQ + 1} of {total}
      </p>

      {/* Progress bar */}
      <div className="progress-bar-bg" style={{ marginBottom: 20 }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <div className="quiz-question">{question.question}</div>

      {/* Options */}
      {question.options.map((option, i) => (
        <button
          key={i}
          className={getOptionClass(option)}
          onClick={() => handleSelect(option)}
          disabled={answered}
        >
          <span className="radio-circle">
            {answered && option === question.correct_answer && (
              <span style={{ color: "#fff", fontSize: "0.7rem" }}>✓</span>
            )}
            {answered && option === selected && option !== question.correct_answer && (
              <span style={{ color: "#fff", fontSize: "0.7rem" }}>✕</span>
            )}
          </span>
          {option}
        </button>
      ))}

      {/* Next button (shown after answering) */}
      {answered && (
        <button className="btn-primary" style={{ marginTop: 12 }} onClick={handleNext}>
          {currentQ < total - 1 ? "Next Question" : "See Results"}
        </button>
      )}
    </div>
  );
}

export default Quiz;
