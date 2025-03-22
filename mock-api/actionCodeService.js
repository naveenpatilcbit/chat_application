const express = require("express");
const router = express.Router();

router.get("/actionCode/list-all-methods", (req, res) => {
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
