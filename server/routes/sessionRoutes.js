const express = require("express");
const Session = require("../models/Session");
const User = require("../models/User");
const router = express.Router();


// =========================
// CREATE SESSION REQUEST
// =========================

router.post("/", async (req, res) => {
  try {

    const {
      userId,
      trainerId,
      date,
      time,
      type,
      message,
    } = req.body;

    if (!userId || !trainerId || !date || !time || !type) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const user = await User.findOne({
      _id: userId,
      role: "user",
    });

    const trainer = await User.findOne({
      _id: trainerId,
      role: "trainer",
    });

    if (!user || !trainer) {
      return res.status(404).json({
        message: "User or trainer not found",
      });
    }

    const session = await Session.create({
      userId,
      trainerId,
      date,
      time,
      type,
      message,
    });

    res.status(201).json({
      message: "Session request sent successfully",
      session,
    });

  } catch (error) {

    console.error("CREATE SESSION ERROR:", error);

    res.status(500).json({
      message: "Failed to create session request",
    });

  }
});


// =========================
// GET TRAINER REQUESTS
// =========================

router.get("/trainer/:trainerId", async (req, res) => {
  try {

    const sessions = await Session.find({
      trainerId: req.params.trainerId,
    })
      .populate("userId", "name email location")
      .sort({ createdAt: -1 });

    res.status(200).json(sessions);

  } catch (error) {

    console.error("GET TRAINER SESSIONS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch session requests",
    });

  }
});


// =========================
// UPDATE SESSION STATUS
// =========================

router.put("/:id/status", async (req, res) => {
  try {

    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
      }
    );

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.status(200).json({
      message: `Session ${status}`,
      session,
    });

  } catch (error) {

    console.error("UPDATE SESSION ERROR:", error);

    res.status(500).json({
      message: "Failed to update session",
    });

  }
});


module.exports = router;