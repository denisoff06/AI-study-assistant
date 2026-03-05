// Summary.jsx — Displays AI-generated summary with key points and concepts

import { useState } from "react";

function Summary({ data, onNavigate }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  // Parse summary text into bullet points (split by newlines or bullet markers)
  const lines = data
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter((line) => line.length > 0);

  // Extract concepts: short phrases (under 40 chars) become concept tags
  const concepts = lines.filter((l) => l.length < 40).slice(0, 8);
  const keyPoints = lines.filter((l) => l.length >= 40 || !concepts.includes(l));

  // Copy summary to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="summary-section fade-in">
      <h2>Summary</h2>

      {/* Copy button */}
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy to clipboard"}
      </button>

      {/* Key Points */}
      <h3>Key Points</h3>
      {keyPoints.length > 0
        ? keyPoints.map((point, i) => (
            <div className="key-point" key={i}>
              {point}
            </div>
          ))
        : lines.map((point, i) => (
            <div className="key-point" key={i}>
              {point}
            </div>
          ))}

      {/* Concepts */}
      {concepts.length > 0 && (
        <>
          <h3 style={{ marginTop: 20 }}>Concepts</h3>
          <div className="concepts-grid">
            {concepts.map((concept, i) => (
              <span className="concept-tag" key={i}>
                {concept}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="nav-buttons">
        <button className="btn-secondary" onClick={() => onNavigate("new")}>
          Back
        </button>
        <button className="btn-primary" style={{ flex: 1 }} onClick={() => onNavigate("flashcards")}>
          Next: Flashcards
        </button>
      </div>
    </div>
  );
}

export default Summary;
