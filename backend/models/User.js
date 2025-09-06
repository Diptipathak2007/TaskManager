const mongoose=require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // don’t return password in queries by default
    },
    profileImageUrl: {
      type: String,
      default: null, // optional, can be updated later
    },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member", // default role
    },
    adminInviteCode: {
      type: String,
      default: null, // token for admin invitation, can be null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

