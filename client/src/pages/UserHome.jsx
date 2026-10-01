import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserHome.css";

function UserHome() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [search, setSearch] = useState("");
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // =========================
  // FETCH TRAINERS
  // =========================

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/trainers"
        );

        setTrainers(response.data);
      } catch (error) {
        console.error("Failed to fetch trainers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // =========================
  // FETCH POSTS
  // =========================

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/posts"
        );

        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredTrainers = trainers.filter((trainer) => {
    const searchText = search.toLowerCase();

    return (
      trainer.name?.toLowerCase().includes(searchText) ||
      trainer.location?.toLowerCase().includes(searchText) ||
      trainer.specialization?.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="user-home">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <div className="logo">
          <span>⚡</span>
          Core Fitness Club
        </div>

        <div className="nav-actions">

          <button
            className="nav-button"
            onClick={() => navigate("/user/profile")}
          >
            👤 Profile
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =========================
          HERO
      ========================= */}

      <section className="hero">

        <div>
          <p className="hero-small">
            WELCOME BACK
          </p>

          <h1>
            Hey, {user?.name || "there"} 👋
          </h1>

          <p>
            Find the right trainer and start your fitness journey.
          </p>
        </div>

      </section>


      {/* =========================
          SEARCH
      ========================= */}

      <section className="search-section">

        <div className="search-box">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search trainers by name, location or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </section>


      {/* =========================
          TRAINERS
      ========================= */}

      <section className="content-section">

        <div className="section-heading">

          <div>
            <p className="section-label">
              DISCOVER
            </p>

            <h2>
              Find Your Trainer
            </h2>
          </div>

          <span className="trainer-count">
            {filteredTrainers.length} trainers
          </span>

        </div>


        {loading ? (

          <p className="loading">
            Finding trainers...
          </p>

        ) : filteredTrainers.length === 0 ? (

          <div className="empty-card">
            <span>🔎</span>
            <h3>No trainers found</h3>
            <p>Try a different search.</p>
          </div>

        ) : (

          <div className="trainer-grid">

            {filteredTrainers.map((trainer) => (

              <div
                className="trainer-card"
                key={trainer._id}
              >

                <div className="trainer-avatar">
                  {trainer.profilePhoto ? (
                    <img
                      src={trainer.profilePhoto}
                      alt={trainer.name}
                    />
                  ) : (
                    "🏋️"
                  )}
                </div>

                <div className="trainer-info">

                  <h3>
                    {trainer.name}
                  </h3>

                  <p className="location">
                    📍 {trainer.location || "Location not provided"}
                  </p>

                  <p className="specialization">
                    {trainer.specialization || "Fitness Trainer"}
                  </p>

                  {trainer.experience && (
                    <p className="experience">
                      {trainer.experience} years experience
                    </p>
                  )}

                </div>

                <div className="card-actions">

                  <button
                    className="primary-button"
                    onClick={() =>
                      navigate(`/trainer/${trainer._id}`)
                    }
                  >
                    View Profile
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      navigate(`/chat/${trainer._id}`)
                    }
                  >
                    💬
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* =========================
          FITNESS FEED
      ========================= */}

      <section className="content-section feed-section">

        <div className="section-heading">

          <div>
            <p className="section-label">
              FITNESS COMMUNITY
            </p>

            <h2>
              Latest from Trainers
            </h2>
          </div>

        </div>


        {postsLoading ? (

          <p className="loading">
            Loading fitness content...
          </p>

        ) : posts.length === 0 ? (

          <div className="empty-card">
            <span>💪</span>
            <h3>No posts yet</h3>
            <p>Trainers will share fitness content here.</p>
          </div>

        ) : (

          <div className="feed">

            {posts.map((post) => (

              <article
                className="post-card"
                key={post._id}
              >

                <div className="post-header">

                  <div className="post-avatar">
                    {post.trainerId?.profilePhoto ? (
                      <img
                        src={post.trainerId.profilePhoto}
                        alt={post.trainerId.name}
                      />
                    ) : (
                      "🏋️"
                    )}
                  </div>

                  <div>
                    <h3>
                      {post.trainerId?.name}
                    </h3>

                    <p>
                      📍 {post.trainerId?.location || "Location unavailable"}
                    </p>
                  </div>

                </div>


                {post.imageUrl && (
                  <img
                    className="post-image"
                    src={post.imageUrl}
                    alt="Fitness post"
                  />
                )}


                <div className="post-content">

                  <span className="category">
                    {post.category}
                  </span>

                  <p className="caption">
                    {post.caption}
                  </p>

                  <div className="post-actions">

                    <button
                      onClick={() =>
                        navigate(
                          `/trainer/${post.trainerId?._id}`
                        )
                      }
                    >
                      View Trainer
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/chat/${post.trainerId?._id}`
                        )
                      }
                    >
                      💬 Chat
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default UserHome;