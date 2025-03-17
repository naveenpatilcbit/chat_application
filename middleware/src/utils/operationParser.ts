import { Operation } from "../types/interfaces";

class OperationParser {
  static parse(instructions: string): Operation {
    return {
      type: this.parseOperationType(instructions),
      name: this.parseName(instructions),
      user: this.parseUser(instructions),
    };
  }

  static parseOperationType(instructions: string): Operation["type"] {
    const lowerInstructions = instructions.toLowerCase();

    if (lowerInstructions.includes("delete")) {
      return "delete";
    } else if (
      lowerInstructions.includes("edit") ||
      lowerInstructions.includes("update")
    ) {
      return "update";
    }

    return "create"; // default operation type
  }

  static parseName(instructions: string): string {
    const nameMatch = instructions.match(/name[:\s]+["']?([^"'\n]+)["']?/i);
    return nameMatch ? nameMatch[1].trim() : "";
  }

  static parseUser(instructions: string): string {
    const userMatch = instructions.match(
      /(?:create|update)\s+user[:\s]+["']?([^"'\n]+)["']?/i
    );
    return userMatch ? userMatch[1].trim() : "system";
  }
}

export default OperationParser;
