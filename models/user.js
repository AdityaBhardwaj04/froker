// Import necessary modules
const mongoose = require("mongoose");

// Define the User schema
const UserSchema = new mongoose.Schema({
    phone: String,
    email: { type: String, lowercase: true },
    name: String,
    dateOfRegistration: Date,
    dob: Date,
    monthlySalary: Number,
    status: String,
    password: String,
    purchasePowerAmount: Number,
    totalBorrowAmount: Number,
});

// Create the User model from the schema
const User = mongoose.model("User", UserSchema);
module.exports = User;
