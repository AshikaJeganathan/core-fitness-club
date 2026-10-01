const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "trainer"],
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
    },

    location: {
      type: String,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    fitnessGoal: {
      type: String,
    },

    bio: {
      type: String,
    },

    experience: {
      type: String,
    },

    specialization: {
      type: String,
    },

    trainingType: {
      type: String,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);