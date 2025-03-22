import { Tool } from "./Tool";
import { Method, OperationType, MethodParam } from "./Method";
import toolPersistenceService from "../services/toolPersistenceService";

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

  public async initializeSession(
    userId: string,
    sessionId: string
  ): Promise<void> {
    this.userId = userId;
    this.sessionId = sessionId;
    // Load user's tools from database
    this.tools = await toolPersistenceService.getUserTools(userId);
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
  public async registerTool(tool: Tool): Promise<void> {
    if (!this.tools.some((t) => t.getName() === tool.getName())) {
      await fetchandRegisterMethodsProvidedByTool(tool);
      this.tools.push(tool);
      // Persist tools after registration
      await toolPersistenceService.saveUserTools(this.userId, this.tools);
    } else {
      throw new Error(`Tool with name ${tool.getName()} is already registered`);
    }
  }

  public async deregisterTool(toolName: string): Promise<void> {
    const index = this.tools.findIndex((tool) => tool.getName() === toolName);
    if (index !== -1) {
      this.tools.splice(index, 1);
      // Persist tools after deregistration
      await toolPersistenceService.saveUserTools(this.userId, this.tools);
    } else {
      throw new Error(`Tool with name ${toolName} is not registered`);
    }
  }

  public async clearTools(): Promise<void> {
    this.tools = [];
    // Persist empty tools array
    await toolPersistenceService.saveUserTools(this.userId, this.tools);
  }

  // Method to check if a tool is registered
  public hasTool(toolName: string): boolean {
    return this.tools.some((tool) => tool.getName() === toolName);
  }
}

interface MethodData {
  methodName: string;
  description: string;
  operationType: OperationType;
  endpointURL: string;
  parameters?: MethodParam[];
}

async function fetchandRegisterMethodsProvidedByTool(tool: Tool) {
  // Validate required fields for the tool
  if (!tool.getName().trim()) {
    throw new Error("Tool name is required");
  }
  if (!tool.getDescription().trim()) {
    throw new Error("Tool description is required");
  }
  if (!tool.getBaseUrl().trim()) {
    throw new Error("Tool base URL is required");
  }

  try {
    const response = await fetch(`${tool.getBaseUrl()}/list-all-methods`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(tool.getApiKey() && {
          Authorization: `Bearer ${tool.getApiKey()}`,
        }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    if (
      !responseData ||
      typeof responseData !== "object" ||
      !("endpoints" in responseData)
    ) {
      throw new Error("Invalid response format: missing endpoints array");
    }
    const methodsData = responseData.endpoints as MethodData[];

    methodsData.forEach((methodData: MethodData) => {
      const mappedParams = methodData.parameters?.map((param) => ({
        name: param.name,
        description: param.description,
        type: param.type,
        required: param.required,
      })) as MethodParam[];

      const method = new Method(
        methodData.methodName,
        methodData.description,
        methodData.operationType,
        methodData.endpointURL,
        mappedParams
      );
      tool.addMethod(method);
    });
  } catch (error) {
    console.error(`Error fetching methods for tool ${tool.getName()}:`, error);
  }
}
