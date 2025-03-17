import { Operation } from "../../types/interfaces";
import logger from "../loggerService";

export abstract class BaseMCPService {
  protected baseUrl: string;
  protected apiKey: string;

  constructor() {
    this.baseUrl = process.env.MCP_API_BASE_URL || "http://localhost:3000";
    this.apiKey = process.env.MCP_API_KEY || "";
  }

  protected async makeRequest<T>(
    endpoint: string,
    config: RequestInit
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...config,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          ...config.headers,
        },
      });

      if (!response.ok) {
        throw new Error(
          `MCP API returned ${response.status}: ${await response.text()}`
        );
      }

      const result = await response.json();

      // Log API call
      logger.logAPICall(
        config.method || "GET",
        endpoint,
        Date.now() - startTime,
        response.status
      );

      return result;
    } catch (error) {
      logger.error("MCP API request failed", error as Error, {
        endpoint,
        method: config.method,
        duration: Date.now() - startTime,
      });
      throw error;
    }
  }

  protected getMethodForOperation(type: Operation["type"]): string {
    switch (type) {
      case "create":
        return "POST";
      case "update":
        return "PUT";
      case "delete":
        return "DELETE";
      default:
        return "POST";
    }
  }
}
