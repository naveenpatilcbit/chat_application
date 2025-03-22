import db from "./db";
import { Tool } from "../models/Tool";
import { RowDataPacket } from "mysql2";
import logger from "./loggerService";

interface UserToolsRow extends RowDataPacket {
  tools: string;
}

interface ToolData {
  name: string;
  description: string;
  baseUrl: string;
  apiKey: string;
  supportedMethods: any[];
}

class ToolPersistenceService {
  async saveUserTools(userId: string, tools: Tool[]): Promise<void> {
    const toolsData = tools.map((tool) => ({
      name: tool.getName(),
      description: tool.getDescription(),
      baseUrl: tool.getBaseUrl(),
      apiKey: tool.getApiKey(),
      supportedMethods: tool.getSupportedMethods(),
    }));

    const toolsJson = JSON.stringify(toolsData);

    try {
      await db.execute(
        "INSERT INTO user_tools (user_id, tools) VALUES (?, ?) ON DUPLICATE KEY UPDATE tools = ?",
        [userId, toolsJson, toolsJson]
      );
      logger.info(`Tools saved successfully for user ${userId}`);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Unknown database error");
      logger.error("Error saving tools to database:", err);
      throw err;
    }
  }

  async getUserTools(userId: string): Promise<Tool[]> {
    try {
      const [rows] = await db.execute<UserToolsRow[]>(
        "SELECT tools FROM user_tools WHERE user_id = ?",
        [userId]
      );

      if (!rows || rows.length === 0) {
        logger.info(`No tools found for user ${userId}`);
        return [];
      }

      const rawTools = rows[0].tools;
      logger.info("Raw tools data from database:", rawTools);

      // Handle case where tools might be stored as an object instead of array
      let toolsData: ToolData[];
      try {
        // Check if rawTools is a string that needs parsing
        const parsed =
          typeof rawTools === "string" ? JSON.parse(rawTools) : rawTools;

        // Convert to array if it's an object
        toolsData = Array.isArray(parsed)
          ? parsed
          : Object.values(parsed).filter(
              (value): value is ToolData =>
                typeof value === "object" &&
                value !== null &&
                "name" in value &&
                "description" in value &&
                "baseUrl" in value &&
                "apiKey" in value
            );

        if (!Array.isArray(toolsData)) {
          throw new Error("Tools data is not in the expected format");
        }
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error("Invalid tools data format");
        logger.error("Error processing tools data:", err);
        return [];
      }

      logger.info("Processed tools data:", toolsData);

      return toolsData.map((data) => {
        const tool = new Tool(
          data.name,
          data.description,
          data.baseUrl,
          data.apiKey
        );
        if (Array.isArray(data.supportedMethods)) {
          tool.setSupportedMethods(data.supportedMethods);
        }
        return tool;
      });
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Database query error");
      logger.error("Error retrieving tools from database:", err);
      throw err;
    }
  }
}

export default new ToolPersistenceService();
