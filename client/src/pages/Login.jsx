import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");

      if (user.role === "trainer") {
        navigate("/trainer/home");
      } else {
        navigate("/user/home");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* LOGO */}

        <div className="login-logo">

          <div className="login-logo-icon">
            ⚡
          </div>

          <h1>
            Core Fitness Club
          </h1>

          <p>
            Train smarter. Connect locally.
          </p>

        </div>


        {/* TITLE */}

        <h2>
          Welcome back
        </h2>

        <p className="login-subtitle">
          Login to continue your fitness journey.
        </p>


        {/* FORM */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <label>
            Email

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </label>


          <label>
            Password

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </label>


          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>


        {/* SIGNUP */}

        <div className="signup-text">

          Don't have an account?

          <button
            className="signup-button"
            onClick={() => navigate("/signup")}
          >
            Create one
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;