const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get all trainers
router.get("/", async (req, res) => {
  try {
    const trainers = await User.find(
      { role: "trainer" },
      "-password"
    ).sort({ createdAt: -1 });

    res.status(200).json(trainers);

  } catch (error) {
    console.error("GET TRAINERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch trainers",
    });
  }
});
// Get one trainer by ID
router.get("/:id", async (req, res) => {
  try {
    const trainer = await User.findOne({
      _id: req.params.id,
      role: "trainer",
    }).select("-password");

    if (!trainer) {
      return res.status(404).json({
        message: "Trainer not found",
      });
    }

    res.status(200).json(trainer);

  } catch (error) {
    console.error("GET TRAINER ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch trainer",
    });
  }
});
// Follow / Unfollow trainer
router.post("/:id/follow", async (req, res) => {
  try {
    const { userId } = req.body;

    const trainerId = req.params.id;

    // Check user
    const user = await User.findOne({
      _id: userId,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check trainer
    const trainer = await User.findOne({
      _id: trainerId,
      role: "trainer",
    });

    if (!trainer) {
      return res.status(404).json({
        message: "Trainer not found",
      });
    }

    // Check if already following
    const isFollowing = user.following.includes(trainerId);

    if (isFollowing) {

      // UNFOLLOW

      await User.findByIdAndUpdate(userId, {
        $pull: {
          following: trainerId,
        },
      });

      await User.findByIdAndUpdate(trainerId, {
        $pull: {
          followers: userId,
        },
      });

      return res.status(200).json({
        message: "Trainer unfollowed",
        following: false,
        followersCount: trainer.followers.length - 1,
      });
    }

    // FOLLOW

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        following: trainerId,
      },
    });

    await User.findByIdAndUpdate(trainerId, {
      $addToSet: {
        followers: userId,
      },
    });

    return res.status(200).json({
      message: "Trainer followed",
      following: true,
      followersCount: trainer.followers.length + 1,
    });

  } catch (error) {

    console.error("FOLLOW ERROR:", error);

    res.status(500).json({
      message: "Failed to follow trainer",
    });
  }
});

module.exports = router;