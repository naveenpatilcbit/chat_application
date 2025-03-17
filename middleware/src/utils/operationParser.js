class OperationParser {
  static parse(instructions) {
    return {
      type: this.parseOperationType(instructions),
      name: this.parseName(instructions),
      user: this.parseUser(instructions),
    };
  }

  static parseOperationType(instructions) {
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

  static parseName(instructions) {
    const nameMatch = instructions.match(/name[:\s]+["']?([^"'\n]+)["']?/i);
    return nameMatch ? nameMatch[1].trim() : "";
  }

  static parseUser(instructions) {
    const userMatch = instructions.match(
      /(?:create|update)\s+user[:\s]+["']?([^"'\n]+)["']?/i
    );
    return userMatch ? userMatch[1].trim() : "system";
  }
}

module.exports = OperationParser;
