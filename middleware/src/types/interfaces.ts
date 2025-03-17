export interface APIError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export interface Operation {
  type: "create" | "update" | "delete";
  name: string;
  user: string;
}

export interface MCPResponse {
  success: boolean;
  operation: Operation["type"];
  result: any;
}

export interface Message {
  id: number;
  message: string;
  llmProcessed: boolean;
  mcpResponse: MCPResponse;
  timestamp: string;
  [key: string]: any;
}
