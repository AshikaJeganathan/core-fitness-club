const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// =========================
// SIGNUP
// =========================

router.post("/signup", async (req, res) => {
  try {

    const {
      role,
      name,
      email,
      password,
      age,
      location,
      fitnessGoal,
      bio,
      experience,
      specialization,
      trainingType,
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      role,
      name,
      email,
      password: hashedPassword,
      age,
      location,
      fitnessGoal,
      bio,
      experience,
      specialization,
      trainingType,
    });

    res.status(201).json({
      message: "Account created successfully",

      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.error("SIGNUP ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        profilePhoto: user.profilePhoto,
      },
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// IMPORTANT: this must be at the VERY END
module.exports = router;