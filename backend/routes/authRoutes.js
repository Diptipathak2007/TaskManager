const express = require('express');
const { get } = require('mongoose');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

//Auth Routes

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/profile',protect,getUserProfile);
router.put('/profile',protect,updateUserProfile);

module.exports = router;