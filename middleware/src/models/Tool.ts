import { Method } from "./Method";

export class Tool {
  private name: string;
  private description: string;
  private baseUrl: string;
  private apiKey: string;
  private supportedMethods: Method[];

  constructor(
    name: string,
    description: string,
    baseUrl: string,
    apiKey?: string
  ) {
    this.name = name;
    this.description = description;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || "";
    this.supportedMethods = [];
  }

  // Getters
  public getName(): string {
    return this.name;
  }
  public getDescription(): string {
    return this.description;
  }
  public getBaseUrl(): string {
    return this.baseUrl;
  }
  public getApiKey(): string {
    return this.apiKey;
  }
  public getSupportedMethods(): Method[] {
    return [...this.supportedMethods];
  }

  public addMethod(method: Method): void {
    this.supportedMethods.push(method);
  }
  // Setters
  public setName(name: string): void {
    this.name = name;
  }
  public setDescription(description: string): void {
    this.description = description;
  }
  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
  public setSupportedMethods(methods: Method[]): void {
    this.supportedMethods = [...methods];
  }

  public toJSON(): any {
    return {
      toolName: this.name,
      toolDescription: this.description,
      baseUrl: this.baseUrl,
      methods: this.supportedMethods.map((method) => ({
        methodName: method.methodName,
        methodDesc: method.description,
        endPoint: method.endpointURL,
        methodParams:
          method.parameters?.map((param) => ({
            paramName: param.name,
            paramDesc: param.description,
            paramType: param.type || "String",
          })) || [],
      })),
    };
  }
}
