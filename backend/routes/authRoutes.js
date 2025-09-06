const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// -------------------- Multer Setup --------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// -------------------- Auth Routes --------------------

// ✅ Register user with optional profile picture
router.post("/register", upload.single("profilePic"), registerUser);

// Login user
router.post("/login", loginUser);

// Get user profile (protected)
router.get("/profile", protect, getUserProfile);

// Update user profile (protected, optional new profilePic)
router.put("/profile", protect, upload.single("profilePic"), updateUserProfile);

module.exports = router;
