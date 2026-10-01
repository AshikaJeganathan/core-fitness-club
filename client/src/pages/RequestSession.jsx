import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./RequestSession.css";

function RequestSession() {
  const { trainerId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("online");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/api/sessions",
        {
          userId: user.id,
          trainerId,
          date,
          time,
          type,
          message,
        }
      );

      alert("Session request sent successfully!");

      navigate(`/trainer/${trainerId}`);
    } catch (error) {
      console.error(
        "Session request error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to send session request"
      );
    }
  };

  return (
    <div className="request-session-page">

      {/* HEADER */}

      <nav className="request-navbar">

        <button
          className="request-back"
          onClick={() =>
            navigate(`/trainer/${trainerId}`)
          }
        >
          ← Back
        </button>

        <div className="request-logo">
          <span>⚡</span>
          Core Fitness Club
        </div>

      </nav>


      {/* CONTENT */}

      <main className="request-content">

        <div className="request-header">

          <p className="request-label">
            TRAINING SESSION
          </p>

          <h1>
            Request a Session
          </h1>

          <p>
            Choose a convenient time and let the
            trainer know how you'd like to train.
          </p>

        </div>


        {/* FORM */}

        <form
          className="request-card"
          onSubmit={handleSubmit}
        >

          {/* DATE */}

          <label>
            Date

            <input
              type="date"
              value={date}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={(e) =>
                setDate(e.target.value)
              }
              required
            />

          </label>


          {/* TIME */}

          <label>
            Preferred Time

            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(e.target.value)
              }
              required
            />

          </label>


          {/* TYPE */}

          <div className="training-type">

            <p>
              Training Type
            </p>

            <div className="type-options">

              <button
                type="button"
                className={
                  type === "online"
                    ? "type-option active"
                    : "type-option"
                }
                onClick={() =>
                  setType("online")
                }
              >
                <span>💻</span>

                <div>
                  <strong>
                    Online
                  </strong>

                  <small>
                    Train remotely
                  </small>
                </div>

              </button>


              <button
                type="button"
                className={
                  type === "offline"
                    ? "type-option active"
                    : "type-option"
                }
                onClick={() =>
                  setType("offline")
                }
              >
                <span>🏋️</span>

                <div>
                  <strong>
                    Offline
                  </strong>

                  <small>
                    Meet in person
                  </small>
                </div>

              </button>

            </div>

          </div>


          {/* MESSAGE */}

          <label>
            Message

            <textarea
              placeholder="Tell the trainer about your goals, preferred workout, or anything they should know..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              rows="5"
            />

          </label>


          {/* SUBMIT */}

          <button
            type="submit"
            className="request-submit"
          >
            Send Session Request
          </button>


          <p className="request-note">
            The trainer will review your request
            and respond to you.
          </p>

        </form>

      </main>

    </div>
  );
}

export default RequestSession;