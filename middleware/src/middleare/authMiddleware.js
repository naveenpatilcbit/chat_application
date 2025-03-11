// authMiddleware.js
const jwt = require("jsonwebtoken");
const redisClient = require("./redisClient"); // if you're using token blacklisting

function authenticateToken(req, res, next) {
  // Retrieve token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.sendStatus(401); // Unauthorized if no token is provided
  }

  // Optional: Check if the token is blacklisted in Redis
  redisClient.get(token, (err, data) => {
    if (err) return res.sendStatus(500);
    if (data === "blacklisted") {
      return res.status(401).json({ message: "Token has been invalidated" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden if token is invalid or expired
      req.user = user; // Attach user info to the request object
      next();
    });
  });
}

module.exports = authenticateToken;
