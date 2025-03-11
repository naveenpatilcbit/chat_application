const express = require("express");
const cors = require("cors");
const authenticateToken = require("./authMiddleware");
const loginEndpoints = require("./controllers/logincontroller");
const messagesEndpoints = require("./controllers/messagecontroller");

const app = express();
const PORT = 5001;

app.use(express.json());

app.use((req, res, next) => {
  console.log("responding...");
  res.header("Access-Control-Allow-Origin", "*"); // Allow any origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow all methods
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Intercept OPTIONS method and respond with 200 (OK)
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// If you have public routes (e.g., login, register), you can exclude them:
app.use((req, res, next) => {
  // Array of public paths that don't require authentication
  const publicPaths = ["/login", "/register"];
  if (publicPaths.includes(req.path)) {
    return next();
  }
  // For all other routes, ensure authentication
  authenticateToken(req, res, next);
});

app.use("/", messagesEndpoints);
app.use("/", loginEndpoints);

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
