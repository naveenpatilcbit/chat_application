import { getLLMProvider } from "../factories/llmfactory";
import { systemPrompt, userPrompt } from "../templates/promptTemplate";
import { ChatClientManager } from "../providers/ChatClientManager";
import logger from "../services/loggerService";
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Define interfaces for type safety
interface Tool {
  toJSON(): string;
}

interface ChatClient {
  getTools(): Tool[];
}

interface PromptPair {
  system: string;
  user: string;
}

class LLMService {
  private llm: BaseLanguageModel;

  constructor() {
    this.llm = getLLMProvider("openai");
  }

  async processMessage(message: string, sessionId: string): Promise<string> {
    try {
      logger.info("Processing message:", message);
      const chatClientManager = ChatClientManager.getInstance();
      const chatClient = chatClientManager.getClient(sessionId);

      if (!chatClient) {
        throw new Error("Chat client not found for session: " + sessionId);
      }

      const { system, user } = this.generatePrompts(message, chatClient);
      logger.info("System prompt:", system);
      logger.info("User prompt:", user);

      const response = await this.llm.invoke([
        new SystemMessage(system),
        new HumanMessage(user),
      ]);

      const llmResponse = response.content.toString();
      logger.info("LLM response:", llmResponse);

      return llmResponse.trim();
    } catch (error) {
      if (error instanceof Error) {
        logger.error("LLM processing failed", error);
        throw error;
      }
      const unknownError = new Error(
        "An unknown error occurred during LLM processing"
      );
      logger.error("LLM processing failed", unknownError);
      throw unknownError;
    }
  }

  private generatePrompts(message: string, chatClient: ChatClient): PromptPair {
    const tools = chatClient.getTools();
    const toolsString = tools.map((tool) => tool.toJSON()).join("\n");

    return {
      system: systemPrompt.replace("{{tools}}", toolsString),
      user: userPrompt.replace("{{userQuery}}", message),
    };
  }
}

// Export a singleton instance
export default new LLMService();
