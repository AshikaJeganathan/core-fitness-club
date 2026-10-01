import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./TrainerProfile.css";

function TrainerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/trainers/${id}`
        );

        const trainerData = response.data;

        setTrainer(trainerData);
        setFollowersCount(trainerData.followers?.length || 0);

        const user = JSON.parse(localStorage.getItem("user"));

        setFollowing(
          trainerData.followers?.some(
            (followerId) =>
              followerId.toString() === user?.id
          )
        );
      } catch (error) {
        console.error("Failed to fetch trainer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

  const handleFollow = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Please login first");
        return;
      }

      const response = await axios.post(
        `http://localhost:5001/api/trainers/${id}/follow`,
        {
          userId: user.id,
        }
      );

      setFollowing(response.data.following);
      setFollowersCount(response.data.followersCount);
    } catch (error) {
      console.error("Follow error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        Loading trainer profile...
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="profile-loading">
        Trainer not found.
      </div>
    );
  }

  return (
    <div className="trainer-profile-page">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          <span>⚡</span>
          Core Fitness Club
        </div>

        <button
          className="nav-button"
          onClick={() => navigate("/user/home")}
        >
          ← Back
        </button>

      </nav>


      {/* PROFILE HEADER */}

      <section className="trainer-profile-header">

        <div className="profile-avatar">

          {trainer.profilePhoto ? (
            <img
              src={trainer.profilePhoto}
              alt={trainer.name}
            />
          ) : (
            "🏋️"
          )}

        </div>

        <div className="profile-main">

          <p className="profile-role">
            PROFESSIONAL TRAINER
          </p>

          <h1>{trainer.name}</h1>

          <p className="profile-location">
            📍 {trainer.location || "Location not provided"}
          </p>

          <div className="profile-stats">

            <div>
              <strong>{followersCount}</strong>
              <span>Followers</span>
            </div>

            <div>
              <strong>{trainer.experience || "—"}</strong>
              <span>Experience</span>
            </div>

          </div>

        </div>

      </section>


      {/* ACTIONS */}

      <section className="profile-actions">

        <button
          className={
            following
              ? "profile-button following"
              : "profile-button primary"
          }
          onClick={handleFollow}
        >
          {following ? "Following ✓" : "Follow"}
        </button>

        <button
          className="profile-button secondary"
          onClick={() =>
            navigate(`/chat/${trainer._id}`)
          }
        >
          💬 Chat
        </button>

        <button
          className="profile-button secondary"
          onClick={() =>
            navigate(`/request-session/${trainer._id}`)
          }
        >
          📅 Request Session
        </button>

      </section>


      {/* PROFILE CONTENT */}

      <main className="trainer-profile-content">

        <section className="profile-card">

          <p className="section-label">
            ABOUT
          </p>

          <h2>About {trainer.name}</h2>

          <p>
            {trainer.bio ||
              "This trainer has not added a bio yet."}
          </p>

        </section>


        <div className="profile-info-grid">

          <section className="profile-card">

            <p className="section-label">
              SPECIALIZATION
            </p>

            <h3>
              {trainer.specialization ||
                "Fitness Training"}
            </h3>

            <p>
              Specialized training designed around
              your fitness goals.
            </p>

          </section>


          <section className="profile-card">

            <p className="section-label">
              TRAINING TYPE
            </p>

            <h3>
              {trainer.trainingType ||
                "Online & Offline"}
            </h3>

            <p>
              Choose the training format that works
              best for you.
            </p>

          </section>

        </div>


        <section className="profile-card">

          <p className="section-label">
            EXPERIENCE
          </p>

          <h2>
            {trainer.experience
              ? `${trainer.experience} years`
              : "Experience not specified"}
          </h2>

        </section>


        {/* POSTS */}

        <section className="profile-card">

          <p className="section-label">
            FITNESS CONTENT
          </p>

          <h2>Posts</h2>

          <div className="empty-posts">

            <span>💪</span>

            <h3>
              No posts yet
            </h3>

            <p>
              This trainer hasn't shared any
              fitness content yet.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default TrainerProfile;