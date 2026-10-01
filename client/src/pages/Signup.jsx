import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
    const navigate = useNavigate();
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    location: "",
    fitnessGoal: "",
    bio: "",
    experience: "",
    specialization: "",
    trainingType: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:5001/api/auth/signup",
      {
        role,
        ...formData,
      }
    );

    alert(response.data.message);

    navigate("/");
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};

return (
  <div className="signup-page">

    <div className="signup-container">

      {/* HEADER */}

      <div className="signup-header">

        <div className="signup-logo">
          ⚡
        </div>

        <h1>Core Fitness Club</h1>

        <p>
          Start your fitness journey today
        </p>

      </div>


      {/* ROLE SELECTION */}

      <div className="role-selector">

        <button
          type="button"
          className={
            role === "user"
              ? "role-button active"
              : "role-button"
          }
          onClick={() => setRole("user")}
        >
          👤 User
        </button>

        <button
          type="button"
          className={
            role === "trainer"
              ? "role-button active"
              : "role-button"
          }
          onClick={() => setRole("trainer")}
        >
          🏋️ Trainer
        </button>

      </div>


      {/* USER FORM */}

      {role === "user" && (
        <form
          className="signup-form"
          onSubmit={handleSubmit}
        >

          <h2>User Registration</h2>

          <label>
            Full Name

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>


          <label>
            Email

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>


          <label>
            Password

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>


          <div className="form-row">

            <label>
              Age

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />
            </label>


            <label>
              Location

              <input
                type="text"
                name="location"
                placeholder="e.g. Chennai"
                value={formData.location}
                onChange={handleChange}
              />
            </label>

          </div>


          <label>
            Fitness Goal

            <select
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={handleChange}
            >
              <option value="">
                Select Fitness Goal
              </option>

              <option value="weight-loss">
                Weight Loss
              </option>

              <option value="muscle-gain">
                Muscle Gain
              </option>

              <option value="strength">
                Strength
              </option>

              <option value="flexibility">
                Flexibility
              </option>

              <option value="general-fitness">
                General Fitness
              </option>

            </select>
          </label>


          <button
            type="submit"
            className="signup-submit"
          >
            Create User Account
          </button>

        </form>
      )}


      {/* TRAINER FORM */}

      {role === "trainer" && (
        <form
          className="signup-form"
          onSubmit={handleSubmit}
        >

          <h2>Trainer Registration</h2>


          <label>
            Trainer Name

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>


          <label>
            Email

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>


          <label>
            Password

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>


          <label>
            Location

            <input
              type="text"
              name="location"
              placeholder="e.g. Chennai"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </label>


          <div className="form-row">

            <label>
              Years of Experience

              <input
                type="text"
                name="experience"
                placeholder="e.g. 5 years"
                value={formData.experience}
                onChange={handleChange}
              />
            </label>


            <label>
              Specialization

              <input
                type="text"
                name="specialization"
                placeholder="e.g. Weight Training"
                value={formData.specialization}
                onChange={handleChange}
              />
            </label>

          </div>


          <label>
            Training Type

            <select
              name="trainingType"
              value={formData.trainingType}
              onChange={handleChange}
            >
              <option value="">
                Select Training Type
              </option>

              <option value="online">
                Online
              </option>

              <option value="offline">
                Offline
              </option>

              <option value="both">
                Online & Offline
              </option>

            </select>
          </label>


          <label>
            About You

            <textarea
              name="bio"
              placeholder="Tell people about yourself..."
              value={formData.bio}
              onChange={handleChange}
            />
          </label>


          <button
            type="submit"
            className="signup-submit"
          >
            Create Trainer Account
          </button>

        </form>
      )}


      {/* LOGIN LINK */}

      <div className="login-link">

        Already have an account?

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Login
        </button>

      </div>

    </div>

  </div>
);
}

export default Signup;