// Import necessary modules
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

// Route to handle borrowing requests
router.post("/", authMiddleware, async (req, res) => {
    const { borrowAmount, tenure } = req.body;

    try {
        // Set default tenure if not provided
        const loanTenure = tenure || 12; // Default to 12 months

        // Validate tenure
        if (loanTenure <= 0) {
            return res
                .status(400)
                .json({ message: "Invalid tenure. Must be greater than 0." });
        }

        // Find user by ID from the auth token
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user's purchase power amount
        user.purchasePowerAmount -= borrowAmount;

        // Calculate monthly repayment with compound interest
        const annualInterestRate = 0.08; // 8% annual interest rate
        const monthlyInterestRate = annualInterestRate / 12; // Convert to monthly interest rate
        const monthlyRepayment =
            (borrowAmount *
                (monthlyInterestRate *
                    Math.pow(1 + monthlyInterestRate, loanTenure))) /
            (Math.pow(1 + monthlyInterestRate, loanTenure) - 1);

        // Save the updated user data
        await user.save();

        // Respond with the updated purchase power amount and monthly repayment
        res.status(200).json({
            purchasePowerAmount: user.purchasePowerAmount,
            monthlyRepayment: monthlyRepayment.toFixed(2), // Format to 2 decimal places
        });
    } catch (error) {
        // Handle internal server error
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
