const express = require("express");
const router = express.Router();
const mcpService = require("../services/mcpService");
const llmService = require("../services/llmService");
const OperationParser = require("../utils/operationParser");
const mcpConfig = require("../config/mcp.config");

// Array to store messages if not defined elsewhere
const messages = [];

router.get("/api/messages", (req, res) => {
  const response = { ok: true };
  const page = parseInt(req.query.page) || 1;
  const startIndex = (page - 1) * mcpConfig.pageSize;
  const endIndex = page * mcpConfig.pageSize;

  response.json = messages.slice(
    messages.length - endIndex,
    messages.length - startIndex
  );
  res.json(response);
});

router.post("/api/messages", async (req, res) => {
  try {
    // Process the incoming message with LLM
    const llmInstructions = await llmService.processMessage(req.body.message);

    // Parse the instructions
    const operation = OperationParser.parse(llmInstructions);

    // Interact with MCP host based on parsed instructions
    const mcpResponse = await mcpService.interactWithMCPHost(operation);

    const newMessage = {
      ...req.body,
      id: messages.length + 1,
      message: req.body.message,
      llmProcessed: true,
      mcpResponse: mcpResponse,
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);

    // Send response with both original message and processed results
    res.status(201).json({
      message: newMessage,
      llmInstructions,
      mcpResponse,
    });
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({
      error: "Failed to process message",
      details: error.message,
    });
  }
});

module.exports = router;
