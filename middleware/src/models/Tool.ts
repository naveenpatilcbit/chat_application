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

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setDescription(description: string): void {
    this.description = description;
  }
}
