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

      // Parse the LLM response
      const parsedResponse = JSON.parse(llmResponse);

      if (parsedResponse.Decision) {
        if (parsedResponse.Decision === "Tool required") {
          const { "Final URL": finalUrl, Parameters } =
            parsedResponse["Invocation Details"];

          try {
            const apiResponse = await fetch(finalUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(Parameters),
            });

            if (!apiResponse.ok) {
              throw new Error(
                `API call failed with status: ${apiResponse.status}`
              );
            }

            const apiResult = await apiResponse.json();
            return JSON.stringify({
              message: parsedResponse.message,
              llmInstructions: parsedResponse.llmInstructions,
              mcpResponse: apiResult,
            });
          } catch (error) {
            logger.error(
              "API call failed:",
              error instanceof Error ? error : new Error(String(error))
            );
            throw new Error("Failed to execute tool action");
          }
        } else {
          return JSON.stringify({
            message: parsedResponse.message,
            response: parsedResponse["Response to User"],
          });
        }
      }

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
    const toolsString = tools
      .map((tool) => JSON.stringify(tool.toJSON(), null, 2))
      .join("\n");

    return {
      system: systemPrompt.replace("{{tools}}", toolsString),
      user: userPrompt.replace("{{userQuery}}", message),
    };
  }
}

// Export a singleton instance
export default new LLMService();
