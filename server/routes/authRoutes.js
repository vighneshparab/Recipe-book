const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// User Registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Create the user with the plaintext password
    // The `pre('save')` middleware in the schema will hash it automatically
    const user = await User.create({
      name,
      email,
      password, // Plaintext password (will be hashed by the schema)
    });

    if (user) {
      // Respond with user data and a generated token
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get User Profile (Protected Route)
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

// Update User Profile (Protected Route)
router.put(
  "/profile",
  protect, // Middleware to ensure the user is authenticated
  upload.single("profilePic"), // Middleware to handle file uploads
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Find the user by ID
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Validation: Check if email is valid
      if (email && !validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Validation: Check if password meets requirements
      if (password && !validatePassword(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        });
      }

      // Update fields if provided in the request
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password; // Password will be hashed by the schema's `pre('save')` middleware
      if (req.file) user.profilePic = `/uploads/${req.file.filename}`; // Update profile picture if uploaded

      // Save the updated user
      const updatedUser = await user.save();

      // Respond with updated user data
      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        token: generateToken(updatedUser.id), // Generate a new token if needed
      });
    } catch (error) {
      // Handle duplicate email error
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Helper function to validate email format
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Helper function to validate password strength
function validatePassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return regex.test(password);
}

module.exports = router;
