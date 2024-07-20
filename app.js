// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Initialize the Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect("mongodb://localhost:27017/money_lending_db");

// Import route handlers
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const userRouter = require("./routes/user");
const borrowRouter = require("./routes/borrow");

// Define routes
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use("/borrow", borrowRouter);

// Home page route
app.get("/", (req, res) => {
    res.status(200).send("Welcome to the Money Lending Application API");
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
