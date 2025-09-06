
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generate JWt token
const generateToken = (userid) => {
  return jwt.sign({ id: userid }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//@desc Register a new user
//@route POST /api/auth/register
//@access Public
const registerUser = async (req, res) => {
    try {
      const { name, email, password, profileImageUrl, adminInviteCode } = req.body;
  
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
  
      // Return user data + token
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

//@desc LOgin user and get token
//@route POST /api/auth/login
//@access Public
const loginUser = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error" }, err.message);
  }
};

//@desc Get user profile
//@route GET /api/auth/profile
//@access Private
const getUserProfile = async (req, res) => {
  try {
    const [name, email, password, profileImageUrl, adminInviteCode] = req.body;
    //check if user already exists
    const UserExists = await User.findOne({ email });
    if (UserExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    //Determine user role
    let role = "member";
    if (adminInviteCode && adminInviteCode === process.env.ADMIN_INVITE_CODE) {
      role = "admin";
    }
    //Hash password
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);
    //Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
      
    });
    //If user created successfully, return user data and token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" }, err.message);
  }
};

//@desc Update user profile
//@route PUT /api/auth/profile
//@access Private
const updateUserProfile = async (req, res) => {};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
