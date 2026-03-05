// App.jsx — Main layout with tab navigation and state management

import { useState } from "react";
import axios from "axios";
import "./index.css";

import Home from "./components/Home";
import InputSection from "./components/InputSection";
import Summary from "./components/Summary";
import Flashcards from "./components/Flashcards";
import Quiz from "./components/Quiz";

const API_URL = "http://localhost:5000/api/generate";

function App() {
  // Active tab: "home" | "new" | "study" | "quiz"
  const [activeTab, setActiveTab] = useState("home");

  // Loading & error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI-generated results
  const [summaryData, setSummaryData] = useState(null);
  const [flashcardsData, setFlashcardsData] = useState(null);
  const [quizData, setQuizData] = useState(null);

  /**
   * Fire all 3 API calls (summary, flashcards, quiz) at once.
   * Stores all results so the user can tab between them without re-generating.
   */
  const handleGenerate = async (subject, notes) => {
    setLoading(true);
    setError("");

    // Prepend subject to notes if provided
    const fullNotes = subject ? `Subject: ${subject}\n\n${notes}` : notes;

    try {
      // Fire all three requests in parallel
      const [summaryRes, flashcardsRes, quizRes] = await Promise.all([
        axios.post(API_URL, { notes: fullNotes, mode: "summary" }),
        axios.post(API_URL, { notes: fullNotes, mode: "flashcards" }),
        axios.post(API_URL, { notes: fullNotes, mode: "quiz" }),
      ]);

      setSummaryData(summaryRes.data.result);
      setFlashcardsData(flashcardsRes.data.result);
      setQuizData(quizRes.data.result);

      // Switch to the Study tab to show results
      setActiveTab("study");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Something went wrong. Please check your connection and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Navigate between study sub-screens
  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  // Render the active screen
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home setActiveTab={setActiveTab} />;
      case "new":
        return (
          <InputSection
            onGenerate={handleGenerate}
            loading={loading}
          />
        );
      case "study":
        // Show summary, or flashcards if navigated there
        return summaryData ? (
          <Summary data={summaryData} onNavigate={handleNavigate} />
        ) : (
          <div className="loading-container fade-in">
            <p>No study materials yet. Start a new session!</p>
            <button
              className="btn-primary"
              style={{ marginTop: 16, width: "auto", padding: "12px 32px" }}
              onClick={() => setActiveTab("new")}
            >
              Create Session
            </button>
          </div>
        );
      case "flashcards":
        return flashcardsData ? (
          <Flashcards data={flashcardsData} onNavigate={handleNavigate} />
        ) : null;
      case "quiz":
        return quizData ? (
          <Quiz data={quizData} onNavigate={handleNavigate} />
        ) : (
          <div className="loading-container fade-in">
            <p>No quiz available yet. Generate study materials first!</p>
            <button
              className="btn-primary"
              style={{ marginTop: 16, width: "auto", padding: "12px 32px" }}
              onClick={() => setActiveTab("new")}
            >
              Create Session
            </button>
          </div>
        );
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <span className="header-icon">🎓</span>
        <h1>StudyAI</h1>
      </header>

      {/* Error banner */}
      {error && (
        <div style={{ padding: "10px 20px", background: "#FEF2F2", textAlign: "center" }}>
          <p className="error-msg" style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Main content area */}
      <main className="main-content">{renderContent()}</main>

      {/* Bottom navigation bar */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          <span className="nav-icon">🏠</span>
          Home
        </button>
        <button
          className={`nav-item ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          <span className="nav-icon">✏️</span>
          New
        </button>
        <button
          className={`nav-item ${activeTab === "study" || activeTab === "flashcards" ? "active" : ""}`}
          onClick={() => setActiveTab(flashcardsData ? "study" : "study")}
        >
          <span className="nav-icon">📖</span>
          Study
        </button>
        <button
          className={`nav-item ${activeTab === "quiz" ? "active" : ""}`}
          onClick={() => setActiveTab("quiz")}
        >
          <span className="nav-icon">❓</span>
          Quiz
        </button>
      </nav>
    </>
  );
}

export default App;
