const config = require("../config/mcp.config");

class MCPService {
  constructor() {
    this.baseUrl = process.env.MCP_API_BASE_URL || "http://localhost:3000";
    this.apiKey = process.env.MCP_API_KEY;
  }

  async interactWithMCPHost(operation) {
    try {
      const config = this.getRequestConfig(operation);
      const response = await fetch(`${this.baseUrl}/dms/actioncodes`, config);

      if (!response.ok) {
        throw new Error(
          `MCP API returned ${response.status}: ${await response.text()}`
        );
      }

      const result = await response.json();
      return {
        success: true,
        operation: operation.type,
        result,
      };
    } catch (error) {
      console.error("MCP Host interaction failed:", error);
      throw new Error(
        `Failed to ${operation?.type || "process"} action code: ${
          error.message
        }`
      );
    }
  }

  getRequestConfig(operation) {
    return {
      method: this.getMethodForOperation(operation.type),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        name: operation.name,
        [operation.type === "create" ? "createUser" : "updateUser"]:
          operation.user,
      }),
    };
  }

  getMethodForOperation(type) {
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

module.exports = new MCPService();
