// server.js
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./db");
const redisClient = require("./../services/redisClient");
const router = express.Router();
const authenticateToken = require("./authMiddleware");
// ====================
// JWT Authentication Middleware
// ====================

// ====================
// Login Endpoint
// ====================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Retrieve user from MySQL by username
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = rows[0];

    // Compare the provided password with the stored hashed password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.hashed_password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token valid for 1 hour
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ====================
// Logout Endpoint
// ====================
// Logout Endpoint with token invalidation
app.post("/logout", authenticateToken, (req, res) => {
  // Get token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Decode the token to find its expiry time
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    // Calculate TTL (time-to-live) for the blacklist entry in seconds
    const exp = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const ttl = exp - currentTime;

    // Add the token to the blacklist in Redis with the calculated TTL
    redisClient.set(token, "blacklisted", "EX", ttl, (err) => {
      if (err)
        return res.status(500).json({ message: "Error invalidating token" });
      res.json({ message: "Logged out successfully" });
    });
  });
});
