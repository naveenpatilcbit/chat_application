export type OperationType = "GET" | "POST" | "PATCH" | "DELETE";

export interface MethodParam {
  name: string;
  description: string;
  required?: boolean;
  type?: string;
}

export class Method {
  constructor(
    public methodName: string,
    public description: string,
    public operationType: OperationType,
    public endpointURL: string,
    public parameters?: MethodParam[]
  ) {}

  // Helper method to validate if the method has parameters
  hasParameters(): boolean {
    return this.parameters !== undefined && this.parameters.length > 0;
  }

  // Helper method to get required parameters
  getRequiredParameters(): MethodParam[] {
    return this.parameters?.filter((param) => param.required) || [];
  }

  // Helper method to get optional parameters
  getOptionalParameters(): MethodParam[] {
    return this.parameters?.filter((param) => !param.required) || [];
  }
}
