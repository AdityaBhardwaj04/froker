// Import necessary modules
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

// Route to get user information
router.get("/", authMiddleware, async (req, res) => {
    try {
        // Find user by ID and select specific fields
        const user = await User.findById(req.userId).select(
            "purchasePowerAmount phone email dateOfRegistration dob monthlySalary"
        );
        res.status(200).json(user);
    } catch (error) {
        // Handle internal server error
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
