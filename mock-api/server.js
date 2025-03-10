const express = require("express");
const cors = require("cors");
const messagesEndpoints = require("./messagesService");

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

app.use("/", messagesEndpoints);

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
