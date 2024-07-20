// Import necessary modules
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Secret key for JWT
const secretKey = "your_secret_key";

// Route to handle user login
router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check if password is provided
        if (!password) {
            return res.status(400).json({ message: "Password is missing" });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, secretKey, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } catch (error) {
        // Handle internal server error
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
