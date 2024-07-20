// Import necessary modules
const express = require("express");
const moment = require("moment");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");

// Route to handle user signup
router.post("/", async (req, res) => {
    const { phone, email, name, dob, monthlySalary, password } = req.body;
    const dateOfRegistration = new Date();

    try {
        // Calculate age from date of birth
        const age = moment().diff(moment(dob, "YYYY-MM-DD"), "years");

        // Validate age and monthly salary
        if (age < 20) {
            return res
                .status(400)
                .json({ message: "User should be above 20 years of age" });
        }
        if (monthlySalary < 25000) {
            return res
                .status(400)
                .json({ message: "Monthly salary should be 25k or more" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set initial purchase power amount (2 times monthly salary simialr to some credit card companies)
        const initialPurchasePowerAmount = monthlySalary * 2;

        // Create a new user object
        const user = new User({
            phone,
            email,
            name,
            dateOfRegistration,
            dob,
            monthlySalary,
            password: hashedPassword,
            status: "approved",
            purchasePowerAmount: initialPurchasePowerAmount,
            totalBorrowAmount: 0,
        });

        // Save the user to the database
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        // Handle internal server error
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
