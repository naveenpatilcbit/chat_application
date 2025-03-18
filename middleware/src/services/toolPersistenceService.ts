import db from "./db";
import { Tool } from "../models/Tool";
import { RowDataPacket } from "mysql2";

interface UserToolsRow extends RowDataPacket {
  tools: string;
}

class ToolPersistenceService {
  async saveUserTools(userId: string, tools: Tool[]): Promise<void> {
    const toolsJson = JSON.stringify(
      tools.map((tool) => ({
        name: tool.getName(),
        description: tool.getDescription(),
        baseUrl: tool.getBaseUrl(),
        apiKey: tool.getApiKey(),
        supportedMethods: tool.getSupportedMethods(),
      }))
    );

    await db.execute(
      "INSERT INTO user_tools (user_id, tools) VALUES (?, ?) ON DUPLICATE KEY UPDATE tools = ?",
      [userId, toolsJson, toolsJson]
    );
  }

  async getUserTools(userId: string): Promise<Tool[]> {
    const [rows] = await db.execute<UserToolsRow[]>(
      "SELECT tools FROM user_tools WHERE user_id = ?",
      [userId]
    );

    if (!rows || rows.length === 0) {
      return [];
    }

    const toolsData = JSON.parse(rows[0].tools);
    return toolsData.map((data: any) => {
      const tool = new Tool(
        data.name,
        data.description,
        data.baseUrl,
        data.apiKey
      );
      tool.setSupportedMethods(data.supportedMethods);
      return tool;
    });
  }
}

export default new ToolPersistenceService();
