// Import necessary modules
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

// Route to handle borrowing requests
router.post("/", authMiddleware, async (req, res) => {
    const { borrowAmount } = req.body;

    try {
        // Find user by ID from the auth token
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user's purchase power amount
        user.purchasePowerAmount -= borrowAmount;

        // Calculate monthly repayment with interest
        const interestRate = 0.08;
        const tenure = 12; // 12 months
        const monthlyRepayment = (borrowAmount * (1 + interestRate)) / tenure;

        // Save the updated user data
        await user.save();

        // Respond with the updated purchase power amount and monthly repayment
        res.status(200).json({
            purchasePowerAmount: user.purchasePowerAmount,
            monthlyRepayment,
        });
    } catch (error) {
        // Handle internal server error
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
