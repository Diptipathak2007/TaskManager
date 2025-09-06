const express = require('express');
const multer = require('multer');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');


const router = express.Router();

// -------------------- Multer Setup --------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// -------------------- Auth Routes --------------------

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile (protected)
router.get('/profile', protect, getUserProfile);

// Update user profile (protected)
router.put('/profile', protect, updateUserProfile);

// Upload profile image (protected)
router.post('/upload-image', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
