// InputSection.jsx — "New Session" screen for entering notes

import { useState } from "react";

function InputSection({ onGenerate, loading }) {
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = () => {
    // Validate inputs
    if (!notes.trim()) {
      setError("Please paste your study notes before generating.");
      return;
    }
    if (notes.trim().length < 20) {
      setError("Please provide more detailed notes (at least 20 characters).");
      return;
    }
    setError("");
    onGenerate(subject.trim(), notes.trim());
  };

  return (
    <div className="input-section fade-in">
      <h2>New Study Session</h2>

      {/* Subject input */}
      <div className="input-group">
        <label>Subject</label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Biology, History, Computer Science"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Notes textarea */}
      <div className="input-group">
        <label>Your Notes</label>
        <textarea
          className="input-field"
          rows={8}
          placeholder="Paste your study notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Tips box */}
      <div className="tips-box">
        <h4>Tips for better results</h4>
        <ul>
          <li>Be specific with your subject</li>
          <li>Include key details in your notes</li>
          <li>Keep your goal in mind</li>
        </ul>
      </div>

      {/* Error message */}
      {error && <p className="error-msg">{error}</p>}

      {/* Loading state */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Generating your study materials...</p>
        </div>
      ) : (
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          Generate Study Materials
        </button>
      )}
    </div>
  );
}

export default InputSection;
