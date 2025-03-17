import { Router } from "express";
import { ChatClientManager } from "./../providers/ChatClientManager";
import { Tool } from "../models/Tool";
import authenticateToken from "../middleware/authMiddleware";

const router = Router();
const chatClientManager = ChatClientManager.getInstance();
// Update model for a specific user's ChatClient
router.post("/update-model", authenticateToken, (req, res) => {
  try {
    const { modelName } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!modelName) {
      return res.status(400).json({ message: "Model name is required" });
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is required" });
    }

    const chatClient = chatClientManager.getClient(token);
    if (!chatClient) {
      return res
        .status(404)
        .json({ message: "ChatClient not found for this session" });
    }

    chatClient.setModelName(modelName);
    res.json({ message: "Model updated successfully", modelName });
  } catch (error) {
    console.error("Error updating model:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update tools for a specific user's ChatClient
router.post("/update-tools", authenticateToken, (req, res) => {
  try {
    const { tools } = req.body;

    const token = req.headers.authorization?.split(" ")[1];

    if (!Array.isArray(tools)) {
      return res.status(400).json({ message: "Tools must be an array" });
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is required" });
    }

    const chatClient = chatClientManager.getClient(token);
    if (!chatClient) {
      return res
        .status(404)
        .json({ message: "ChatClient not found for this session" });
    }

    // Register new tools
    tools.forEach((toolData) => {
      try {
        const tool = new Tool(
          toolData.name,
          toolData.description,
          toolData.baseUrl,
          toolData.apiKey
        );
        chatClient.registerTool(tool);
      } catch (error) {
        console.error(`Error registering tool ${toolData.name}:`, error);
        // Continue with other tools even if one fails
      }
    });

    res.json({
      message: "Tools updated successfully",
      registeredTools: chatClient.getTools().map((tool) => tool.getName()),
    });
  } catch (error) {
    console.error("Error updating tools:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get current model and tools configuration
router.get("/configuration", authenticateToken, (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is required" });
    }

    const chatClient = chatClientManager.getClient(token);
    if (!chatClient) {
      return res
        .status(404)
        .json({ message: "ChatClient not found for this session" });
    }

    res.json({
      modelName: chatClient.getModelName(),
      tools: chatClient.getTools().map((tool) => ({
        name: tool.getName(),
        description: tool.getDescription(),
      })),
    });
  } catch (error) {
    console.error("Error getting configuration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
