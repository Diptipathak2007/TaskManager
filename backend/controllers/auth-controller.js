import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import {sendEmail} from "../libs/send-email.js";
const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "emailVerification" },
      process.env.jwt_secret,
      { expiresIn: "1h" }
    );
    // Store verification record
    await Verification.create({
      userId: newUser._id,
      verificationToken,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    });

    // Build verification link (adjust FRONTEND_URL as needed)
    const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";
    const verificationLink = `${frontendBase}/auth/verify-email?token=${verificationToken}`;


    const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
    const emailSubject = "Verify your email";

    const isEmailSent = await sendEmail(email, emailSubject, emailBody);

    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    res.status(201).json({
      message:
        "Verification email sent to your email. Please check and verify your account.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const loginUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { registerUser, loginUser };
