const messages = require("./sampledata");
const express = require("express");
const router = express.Router();
const PAGE_SIZE = 5;

router.get("/api/messages", (req, res) => {
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

router.post("/api/messages", (req, res) => {
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

module.exports = router;
