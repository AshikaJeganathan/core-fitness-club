import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Chat.css";

function Chat() {
  const { trainerId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [trainer, setTrainer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTrainer();
    fetchMessages();
  }, [trainerId]);

  const fetchTrainer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/trainers/${trainerId}`
      );

      setTrainer(response.data);
    } catch (error) {
      console.error("Error fetching trainer:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/messages/${user.id}/${trainerId}`
      );

      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5001/api/messages",
        {
          senderId: user.id,
          receiverId: trainerId,
          message: message.trim(),
        }
      );

      setMessages([...messages, response.data]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Unable to send message");
    }
  };

  if (!trainer) {
    return (
      <div className="chat-loading">
        <div className="chat-loading-spinner"></div>
        <p>Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="chat-page">

      {/* Navbar */}
      <header className="chat-navbar">

        <button
          className="chat-back-button"
          onClick={() => navigate(`/trainer/${trainerId}`)}
        >
          ←
        </button>

        <div className="chat-trainer-info">

          <div className="chat-avatar">
            {trainer.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{trainer.name}</h2>

            <p>
              {trainer.specialization || "Fitness Trainer"}
              {trainer.location && ` • ${trainer.location}`}
            </p>
          </div>

        </div>

      </header>

      {/* Messages */}
      <main className="chat-main">

        <div className="messages-container">

          {messages.length === 0 ? (
            <div className="chat-empty">

              <div className="chat-empty-icon">💬</div>

              <h3>Start the conversation</h3>

              <p>
                Send a message to {trainer.name} about your fitness goals
                or training sessions.
              </p>

            </div>
          ) : (
            messages.map((msg) => {

              const isMine =
                msg.senderId === user.id ||
                msg.senderId?._id === user.id;

              return (
                <div
                  key={msg._id}
                  className={
                    isMine
                      ? "message-row mine"
                      : "message-row theirs"
                  }
                >
                  <div className="message-bubble">
                    <p>{msg.message}</p>

                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* Message Input */}
        <form
          className="message-form"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="submit">
            Send
          </button>
        </form>

      </main>
    </div>
  );
}

export default Chat;