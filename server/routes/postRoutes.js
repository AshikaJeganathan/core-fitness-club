const express = require("express");
const router = express.Router();
const multer = require("multer");

const cloudinary = require("../config/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");

// ========================================
// MULTER CONFIGURATION
// ========================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "video/mp4",
      "video/quicktime",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG, WEBP, MP4 and MOV files are allowed"
        )
      );
    }
  },
});

// ========================================
// CREATE POST
// ========================================

router.post(
  "/",
  upload.single("media"),
  async (req, res) => {
    try {
      console.log("========== CREATE POST ==========");
      console.log("Body:", req.body);
      console.log(
        "File:",
        req.file
          ? {
              originalname: req.file.originalname,
              mimetype: req.file.mimetype,
              size: req.file.size,
            }
          : "No file"
      );

      const {
        trainerId,
        caption,
        category,
      } = req.body;

      // --------------------------------
      // Validate basic fields
      // --------------------------------

      if (!trainerId || !caption) {
        return res.status(400).json({
          message:
            "Trainer ID and caption are required",
        });
      }

      // --------------------------------
      // Find trainer
      // --------------------------------

      const trainer = await User.findById(
        trainerId
      );

      if (!trainer) {
        return res.status(404).json({
          message: "Trainer not found",
        });
      }

      // --------------------------------
      // Check role
      // --------------------------------

      if (trainer.role !== "trainer") {
        return res.status(403).json({
          message:
            "Only trainers can create posts",
        });
      }

      let mediaUrl = "";
      let mediaType = "";

      // ========================================
      // UPLOAD MEDIA TO CLOUDINARY
      // ========================================

      if (req.file) {
        console.log(
          "Uploading file to Cloudinary..."
        );

        mediaType =
          req.file.mimetype.startsWith("video/")
            ? "video"
            : "image";

        const resourceType =
          mediaType === "video"
            ? "video"
            : "image";

        const uploadResult =
          await new Promise(
            (resolve, reject) => {
              const uploadStream =
                cloudinary.uploader.upload_stream(
                  {
                    resource_type:
                      resourceType,

                    folder:
                      "core-fitness/posts",
                  },

                  (error, result) => {
                    if (error) {
                      console.error(
                        "Cloudinary upload error:",
                        error
                      );

                      reject(error);
                    } else {
                      console.log(
                        "Cloudinary upload successful"
                      );

                      resolve(result);
                    }
                  }
                );

              uploadStream.end(
                req.file.buffer
              );
            }
          );

        mediaUrl =
          uploadResult.secure_url;

        console.log(
          "Cloudinary URL:",
          mediaUrl
        );

        console.log(
          "Media type:",
          mediaType
        );
      }

      // ========================================
      // SAVE POST TO MONGODB
      // ========================================

      const post = await Post.create({
        trainerId: trainerId,

        caption: caption,

        imageUrl: mediaUrl,

        mediaType: mediaType,

        category:
          category || "Fitness",
      });

      console.log(
        "Post saved to MongoDB:",
        post._id
      );

      console.log(
        "================================"
      );

      // ========================================
      // RESPONSE
      // ========================================

      return res.status(201).json({
        message:
          "Post created successfully",

        post,
      });

    } catch (error) {
      console.error(
        "Create post error:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Failed to create post",
      });
    }
  }
);

// ========================================
// GET ALL POSTS
// ========================================

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate(
        "trainerId",
        "name location specialization profilePhoto"
      )
      .sort({
        createdAt: -1,
      });

    return res.json(posts);

  } catch (error) {
    console.error(
      "Fetch posts error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch posts",
    });
  }
});

module.exports = router;