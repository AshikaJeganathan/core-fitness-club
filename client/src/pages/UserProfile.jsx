import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

function UserProfile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="user-profile-page">

      {/* Navbar */}
      <nav className="user-profile-navbar">
        <button
          className="profile-back-button"
          onClick={() => navigate("/user/home")}
        >
          ← Home
        </button>

        <div className="profile-logo">
          <div className="profile-logo-icon">⚡</div>
          <span>Core Fitness Club</span>
        </div>
      </nav>

      {/* Profile */}
      <main className="user-profile-content">

        <div className="profile-header-card">

          <div className="profile-avatar-large">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="profile-header-info">
            <h1>{user?.name}</h1>
            <p>Fitness Member</p>
          </div>

        </div>

        {/* Personal Information */}
        <section className="profile-section">
          <h2>Personal Information</h2>

          <div className="profile-info-card">

            <div className="profile-info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">
                {user?.name || "Not provided"}
              </span>
            </div>

            <div className="profile-info-item">
              <span className="info-label">Email</span>
              <span className="info-value">
                {user?.email || "Not provided"}
              </span>
            </div>

            <div className="profile-info-item">
              <span className="info-label">Location</span>
              <span className="info-value">
                {user?.location || "Not provided"}
              </span>
            </div>

            <div className="profile-info-item">
              <span className="info-label">Age</span>
              <span className="info-value">
                {user?.age || "Not provided"}
              </span>
            </div>

          </div>
        </section>

        {/* Fitness Information */}
        <section className="profile-section">
          <h2>Fitness Information</h2>

          <div className="profile-info-card">

            <div className="profile-info-item">
              <span className="info-label">Fitness Goal</span>
              <span className="info-value">
                {user?.fitnessGoal || "Not provided"}
              </span>
            </div>

          </div>
        </section>

        {/* Future Features */}
        <section className="profile-section">
          <h2>Your Activity</h2>

          <div className="activity-grid">

            <div className="activity-card">
              <div className="activity-icon">🏋️</div>
              <h3>Sessions</h3>
              <p>Your training sessions will appear here.</p>
            </div>

            <div className="activity-card">
              <div className="activity-icon">💬</div>
              <h3>Messages</h3>
              <p>Your trainer conversations will appear here.</p>
            </div>

            <div className="activity-card">
              <div className="activity-icon">⭐</div>
              <h3>Trainers</h3>
              <p>Trainers you follow will appear here.</p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default UserProfile;