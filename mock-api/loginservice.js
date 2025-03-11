const express = require("express");
const router = express.Router();

router.post("/api/login", (req, res) => {
  var response = { ok: true };

  res.json(response);
});

module.exports = router;
