// server.js
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./db"); // MySQL connection from db.js

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ====================
// JWT Authentication Middleware
// ====================
function authenticateToken(req, res, next) {
  // Expect the token in the Authorization header as "Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token invalid/expired
    req.user = user; // Attach user info to the request object
    next();
  });
}

// ====================
// Login Endpoint
// ====================
app.post("/login", async (req, res) => {
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
app.post("/logout", (req, res) => {
  // For JWT-based stateless authentication, logging out is usually handled on the client-side
  // by deleting the stored token. If necessary, you can implement token blacklisting.
  res.json({ message: "Logged out successfully" });
});

// ====================
// Example Protected Route
// ====================
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// ====================
// Start the Server
// ====================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
