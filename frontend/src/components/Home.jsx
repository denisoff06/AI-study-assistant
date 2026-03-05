// Home.jsx — Landing/dashboard screen with placeholder recent sessions

function Home({ setActiveTab }) {
  // Static placeholder data for the demo
  const recentSessions = [
    { id: 1, subject: "Cell Biology", icon: "🧬", progress: 80 },
    { id: 2, subject: "World War II History", icon: "📚", progress: 45 },
    { id: 3, subject: "Linear Algebra", icon: "📐", progress: 100 },
  ];

  return (
    <div className="fade-in">
      {/* Welcome message */}
      <div className="home-welcome">
        <h2>Welcome back</h2>
        <p>Keep your momentum going</p>
      </div>

      {/* Recent Sessions */}
      <p className="home-section-title">Recent Sessions</p>

      {recentSessions.map((session) => (
        <div className="card session-card" key={session.id}>
          <div className="session-icon">{session.icon}</div>
          <div className="session-info">
            <h4>{session.subject}</h4>
            <div className="progress-bar-bg">
              <div
                className={`progress-bar-fill ${session.progress === 100 ? "green" : ""}`}
                style={{ width: `${session.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Quick action */}
      <button
        className="btn-primary"
        style={{ marginTop: 12 }}
        onClick={() => setActiveTab("new")}
      >
        + New Study Session
      </button>
    </div>
  );
}

export default Home;
