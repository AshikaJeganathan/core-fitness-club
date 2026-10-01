const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();


// =========================
// SEND MESSAGE
// =========================

router.post("/", async (req, res) => {
  try {

    const {
      senderId,
      receiverId,
      message,
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: message.trim(),
    });

    res.status(201).json(newMessage);

  } catch (error) {

    console.error("SEND MESSAGE ERROR:", error);

    res.status(500).json({
      message: "Failed to send message",
    });

  }
});


// =========================
// GET CONVERSATION
// =========================

router.get("/:user1/:user2", async (req, res) => {
  try {

    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId: user1,
          receiverId: user2,
        },
        {
          senderId: user2,
          receiverId: user1,
        },
      ],
    })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {

    console.error(
      "GET MESSAGES ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch messages",
    });

  }
});


module.exports = router;