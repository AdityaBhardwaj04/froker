// Import necessary modules
const jwt = require("jsonwebtoken");

// Secret key for JWT
const secretKey = "your_secret_key";

// Middleware to authenticate JWT token
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res
            .status(401)
            .json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.userId = decoded.userId;
        next();
    });
};

module.exports = authMiddleware;
