const express = require("express");
const cors = require("cors");
const messages = require("./sampledata");

const app = express();
const PORT = 5001;
const PAGE_SIZE = 5;
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

// Mock Data

// Mock API Endpoints
app.get("/api/messages", (req, res) => {
  var response = { ok: true };
  var params = req.query["page"];
  var startIndex = (params - 1) * PAGE_SIZE;
  var endIndex = params * PAGE_SIZE;

  response.json = messages.slice(
    messages.length - endIndex,
    messages.length - startIndex
  );
  res.json(response);
});

app.post("/api/messages", (req, res) => {
  console.log(req);
  const newMessage = {
    ...req.body,
    id: messages.length + 1,
    message: "successfully responding" + messages.length + 1,
  };
  messages.push(newMessage);
  res.status(201).json(newMessage);
  console.log(newMessage.id);
});

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
