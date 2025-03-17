const getLLMProvider = require("../factories/llmfactory");

class LLMService {
  constructor() {
    this.llm = getLLMProvider("openai");
  }

  async processMessage(message) {
    try {
      const prompt = this.generatePrompt(message);
      const llmResponse = await this.llm.call(prompt);
      return llmResponse.trim();
    } catch (error) {
      console.error("LLM processing failed:", error);
      throw error;
    }
  }

  generatePrompt(message) {
    return `
      Process the following message and generate appropriate instructions for the action codes API.
      The API supports creating, updating, and deleting action codes.
      Required fields: name, user (for create/update operations)
      
      Message: ${message}
      
      Generate a response in this format:
      Operation: [create/update/delete]
      Name: [action code name]
      User: [username for create/update]
      
      Instructions:`;
  }
}

module.exports = new LLMService();
