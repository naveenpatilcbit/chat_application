import { Tool } from "./Tool";

export class ChatClient {
  private model_name: string;
  private model_params: Record<string, any>;
  private tools: Tool[];
  private sessionId: string;
  private userId: string;

  constructor(model_name: string, model_params: Record<string, any> = {}) {
    this.model_name = model_name;
    this.model_params = model_params;
    this.tools = [];
    this.sessionId = "";
    this.userId = "";
  }

  public initializeSession(userId: string, sessionId: string): void {
    this.userId = userId;
    this.sessionId = sessionId;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getUserId(): string {
    return this.userId;
  }

  // Getter methods
  public getModelName(): string {
    return this.model_name;
  }

  public getModelParams(): Record<string, any> {
    return this.model_params;
  }

  public getTools(): Tool[] {
    return [...this.tools];
  }

  // Setter methods
  public setModelName(model_name: string): void {
    this.model_name = model_name;
  }

  public setModelParams(model_params: Record<string, any>): void {
    this.model_params = model_params;
  }

  // Tool management methods
  public registerTool(tool: Tool): void {
    if (!this.tools.some((t) => t.getName() === tool.getName())) {
      this.tools.push(tool);
    } else {
      throw new Error(`Tool with name ${tool.getName()} is already registered`);
    }
  }

  public deregisterTool(toolName: string): void {
    const index = this.tools.findIndex((tool) => tool.getName() === toolName);
    if (index !== -1) {
      this.tools.splice(index, 1);
    } else {
      throw new Error(`Tool with name ${toolName} is not registered`);
    }
  }

  public clearTools(): void {
    this.tools = [];
  }

  // Method to check if a tool is registered
  public hasTool(toolName: string): boolean {
    return this.tools.some((tool) => tool.getName() === toolName);
  }
}
