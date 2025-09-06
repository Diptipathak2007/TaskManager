const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    console.log("Register request body:", req.body);
    console.log("Register request file:", req.file);

    const { name, email, password, adminInviteCode } = req.body;

    // Profile image (if uploaded)
    let profileImageUrl = null;
    if (req.file) {
      profileImageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Determine role
    let role = "member";
    if (adminInviteCode && adminInviteCode === process.env.ADMIN_INVITE_CODE) {
      role = "admin";
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Login user and get token
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body;

    // Update text fields
    if (name) user.name = name;
    if (email) user.email = email;

    // If new image uploaded
    if (req.file) {
      user.profileImageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
