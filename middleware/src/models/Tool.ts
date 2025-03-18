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
}
