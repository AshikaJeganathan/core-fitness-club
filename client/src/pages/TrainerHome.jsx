import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TrainerHome.css";

function TrainerHome() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [posts, setPosts] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Post states
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Fitness");
  const [isUploading, setIsUploading] = useState(false);

  // =========================
  // FETCH SESSION REQUESTS
  // =========================

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/sessions/trainer/${user.id}`
      );

      setSessions(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch session requests:",
        error
      );
    }
  };

  // =========================
  // FETCH POSTS
  // =========================

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/posts"
      );

      const trainerPosts = response.data.filter(
        (post) => post.trainerId?._id === user.id
      );

      setPosts(trainerPosts);
    } catch (error) {
      console.error(
        "Failed to fetch posts:",
        error
      );
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    if (!user?.id) return;

    fetchSessions();
    fetchPosts();
  }, [user?.id]);

  // =========================
  // SELECT MEDIA
  // =========================

  const handleMediaChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "video/mp4",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Please select a JPG, PNG, WEBP, MP4 or MOV file."
      );

      e.target.value = "";
      return;
    }

    // Remove old preview URL
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }

    setMediaFile(file);

    // Create local preview
    const previewUrl = URL.createObjectURL(file);

    setMediaPreview(previewUrl);
  };

  // =========================
  // REMOVE MEDIA
  // =========================

  const handleRemoveMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }

    setMediaFile(null);
    setMediaPreview("");

    const fileInput =
      document.getElementById("trainer-media");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =========================
  // CREATE POST
  // =========================

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!caption.trim()) {
      alert("Please write a caption");
      return;
    }

    try {
      setIsUploading(true);

      // Create multipart form data
      const formData = new FormData();

      formData.append("trainerId", user.id);
      formData.append("caption", caption);
      formData.append("category", category);

      // Add media only if trainer selected one
      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      console.log("Creating post...");
      console.log("Trainer ID:", user.id);
      console.log("Caption:", caption);
      console.log("Category:", category);
      console.log("Media:", mediaFile);

      // Send everything to OUR BACKEND
      // Backend will upload the media to Cloudinary
      const response = await axios.post(
        "http://localhost:5001/api/posts",
        formData
      );

      console.log(
        "Post created successfully:",
        response.data
      );

      alert("Post created successfully!");

      // Reset form
      setCaption("");
      setCategory("Fitness");
      setMediaFile(null);

      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }

      setMediaPreview("");

      const fileInput =
        document.getElementById("trainer-media");

      if (fileInput) {
        fileInput.value = "";
      }

      // Refresh posts
      fetchPosts();

    } catch (error) {
      console.error(
        "Create post error:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to upload media or create post"
      );

    } finally {
      setIsUploading(false);
    }
  };

  // =========================
  // UPDATE SESSION
  // =========================

  const updateSessionStatus = async (
    sessionId,
    status
  ) => {
    try {
      await axios.put(
        `http://localhost:5001/api/sessions/${sessionId}/status`,
        {
          status,
        }
      );

      fetchSessions();

    } catch (error) {
      console.error(
        "Update session error:",
        error
      );

      alert("Failed to update session");
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =========================
  // PAGE
  // =========================

  return (
    <div className="trainer-dashboard">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="trainer-navbar">

        <div className="trainer-logo">
          <span>⚡</span>
          Core Fitness Club
        </div>

        <div className="trainer-nav-actions">

          <button
            onClick={() =>
              navigate(`/trainer/${user.id}`)
            }
          >
            My Profile
          </button>

          <button
            onClick={() =>
              navigate(`/chat/${user.id}`)
            }
          >
            💬 Messages
          </button>

          <button
            className="trainer-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =========================
          HEADER
      ========================= */}

      <header className="trainer-dashboard-header">

        <div>

          <p className="dashboard-label">
            TRAINER DASHBOARD
          </p>

          <h1>
            Welcome, {user?.name} 👋
          </h1>

          <p>
            Manage your fitness community,
            content and session requests.
          </p>

        </div>

      </header>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="trainer-dashboard-content">

        {/* =========================
            CREATE POST
        ========================= */}

        <section className="dashboard-card">

          <div className="dashboard-section-title">

            <div>

              <p className="dashboard-label">
                SHARE
              </p>

              <h2>
                Create a Fitness Post
              </h2>

            </div>

          </div>

          <form
            className="post-form"
            onSubmit={handleCreatePost}
          >

            {/* MEDIA UPLOAD */}

            <div className="media-upload-box">

              <input
                id="trainer-media"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg,video/mp4,video/quicktime"
                onChange={handleMediaChange}
              />

              <label htmlFor="trainer-media">

                <span className="media-upload-icon">
                  📷
                </span>

                <strong>
                  {mediaFile
                    ? mediaFile.name
                    : "Choose a photo or video"}
                </strong>

                <small>
                  JPG, PNG, WEBP, MP4 or MOV
                </small>

              </label>

            </div>

            {/* MEDIA PREVIEW */}

            {mediaPreview && (

              <div className="media-preview">

                {mediaFile?.type.startsWith("video/") ? (

                  <video
                    src={mediaPreview}
                    controls
                  />

                ) : (

                  <img
                    src={mediaPreview}
                    alt="Selected media"
                  />

                )}

                <button
                  type="button"
                  className="remove-media-button"
                  onClick={handleRemoveMedia}
                >
                  Remove
                </button>

              </div>

            )}

            {/* CAPTION */}

            <textarea
              placeholder="Share a workout tip, nutrition advice, motivation..."
              value={caption}
              onChange={(e) =>
                setCaption(e.target.value)
              }
              rows="4"
            />

            {/* CATEGORY */}

            <div className="post-form-bottom">

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >

                <option>Fitness</option>
                <option>Workout</option>
                <option>Nutrition</option>
                <option>Motivation</option>
                <option>Yoga</option>

              </select>

              <button
                type="submit"
                disabled={isUploading}
              >
                {isUploading
                  ? "Uploading..."
                  : "Publish Post"}
              </button>

            </div>

          </form>

        </section>

        {/* =========================
            MY POSTS
        ========================= */}

        <section className="dashboard-card">

          <div className="dashboard-section-title">

            <div>

              <p className="dashboard-label">
                CONTENT
              </p>

              <h2>
                My Posts
              </h2>

            </div>

            <span>
              {posts.length} posts
            </span>

          </div>

          {posts.length === 0 ? (

            <div className="dashboard-empty">

              <span>📝</span>

              <h3>
                No posts yet
              </h3>

              <p>
                Your fitness posts will appear here.
              </p>

            </div>

          ) : (

            <div className="trainer-post-grid">

              {posts.map((post) => (

                <article
                  className="trainer-post"
                  key={post._id}
                >

                  {/* IMAGE POST */}

                  {post.mediaType === "image" &&
                    post.imageUrl && (

                    <img
                      src={post.imageUrl}
                      alt="Fitness"
                    />

                  )}

                  {/* VIDEO POST */}

                  {post.mediaType === "video" &&
                    post.imageUrl && (

                    <video
                      src={post.imageUrl}
                      controls
                    />

                  )}

                  {/* OLD POSTS
                      Created before mediaType
                      was added
                  */}

                  {!post.mediaType &&
                    post.imageUrl && (

                    <img
                      src={post.imageUrl}
                      alt="Fitness"
                    />

                  )}

                  <div className="trainer-post-content">

                    <span>
                      {post.category}
                    </span>

                    <p>
                      {post.caption}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

        {/* =========================
            SESSION REQUESTS
        ========================= */}

        <section className="dashboard-card">

          <div className="dashboard-section-title">

            <div>

              <p className="dashboard-label">
                CLIENTS
              </p>

              <h2>
                Session Requests
              </h2>

            </div>

            <span>
              {sessions.length} requests
            </span>

          </div>

          {sessions.length === 0 ? (

            <div className="dashboard-empty">

              <span>📅</span>

              <h3>
                No session requests
              </h3>

              <p>
                New requests from clients will
                appear here.
              </p>

            </div>

          ) : (

            <div className="session-list">

              {sessions.map((session) => (

                <div
                  className="session-card"
                  key={session._id}
                >

                  <div className="session-user">

                    <div className="session-avatar">
                      👤
                    </div>

                    <div>

                      <h3>
                        {session.userId?.name ||
                          "User"}
                      </h3>

                      <p>
                        {session.userId?.email}
                      </p>

                      <p>
                        📍{" "}
                        {session.userId?.location ||
                          "Location unavailable"}
                      </p>

                    </div>

                  </div>

                  <div className="session-details">

                    <div>

                      <strong>
                        📅 Date
                      </strong>

                      <span>
                        {session.date}
                      </span>

                    </div>

                    <div>

                      <strong>
                        🕐 Time
                      </strong>

                      <span>
                        {session.time}
                      </span>

                    </div>

                    <div>

                      <strong>
                        📍 Type
                      </strong>

                      <span>
                        {session.type}
                      </span>

                    </div>

                  </div>

                  {session.message && (

                    <div className="session-message">

                      <strong>
                        Client message
                      </strong>

                      <p>
                        {session.message}
                      </p>

                    </div>

                  )}

                  <div className="session-footer">

                    <span
                      className={`status ${session.status}`}
                    >
                      {session.status}
                    </span>

                    {session.status === "pending" && (

                      <div className="session-actions">

                        <button
                          className="accept-button"
                          onClick={() =>
                            updateSessionStatus(
                              session._id,
                              "accepted"
                            )
                          }
                        >
                          ✓ Accept
                        </button>

                        <button
                          className="reject-button"
                          onClick={() =>
                            updateSessionStatus(
                              session._id,
                              "rejected"
                            )
                          }
                        >
                          ✕ Reject
                        </button>

                      </div>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default TrainerHome;