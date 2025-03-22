import express, { Request, Response } from "express";
import mcpService from "../services/mcpService";
import llmService from "../services/llmService";
import OperationParser from "../utils/operationParser";
import mcpConfig from "../config/mcp.config";
import logger from "../services/loggerService";

// Define interfaces for type safety
interface Message {
  id: number;
  message: string;
  llmProcessed: boolean;
  mcpResponse: any; // TODO: Replace 'any' with proper type from mcpService
  timestamp: string;
}

interface ApiResponse<T> {
  ok: boolean;
  json?: T;
}

const router = express.Router();

// Array to store messages with proper typing
const messages: Message[] = [];

router.get("/api/messages", (req: Request, res: Response) => {
  const response: ApiResponse<Message[]> = { ok: true };
  const page = parseInt(req.query.page as string) || 1;
  const startIndex = (page - 1) * mcpConfig.pageSize;
  const endIndex = page * mcpConfig.pageSize;

  response.json = messages.slice(
    messages.length - endIndex,
    messages.length - startIndex
  );
  res.json(response);
});

router.post("/api/messages", async (req: Request, res: Response) => {
  try {
    logger.info("Processing message:", req.body.message);

    const authHeader = req.headers["authorization"];
    logger.info("Auth header:" + authHeader);
    const token = authHeader && authHeader.split(" ")[1];

    // Process the incoming message with LLM
    if (token) {
      const llmInstructions = await llmService.processMessage(
        req.body.message,
        token
      );

      logger.info("LLM instructions:", llmInstructions);

      const newMessage: Message = {
        ...req.body,
        id: messages.length + 1,
        message: req.body.message,
        llmProcessed: true,
        mcpResponse: {}, // TODO: Add proper mcpResponse once integrated
        timestamp: new Date().toISOString(),
      };

      messages.push(newMessage);

      // Send response with both original message and processed results
      res.status(201).json({
        message: newMessage,
        llmInstructions,
        mcpResponse: newMessage.mcpResponse,
      });
    }
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({
      error: "Failed to process message",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
