const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    caption: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    mediaType: {
      type: String,
      enum: ["image", "video", ""],
      default: "",
    },

    category: {
      type: String,
      default: "Fitness",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Post",
  postSchema
);