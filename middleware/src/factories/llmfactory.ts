import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { BaseLanguageModel } from "@langchain/core/language_models/base";

type LLMProvider = "openai" | "anthropic";

/**
 * Returns an instance of the LLM based on the provider name.
 * @param providerName - The name of the provider ("openai" or "anthropic").
 * @returns An instance of the LLM.
 */
function getLLMProvider(providerName: LLMProvider): BaseLanguageModel {
  switch (providerName.toLowerCase()) {
    case "openai":
      return new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
      });

    case "anthropic":
      return new ChatAnthropic({
        model: "claude-3-haiku-20240307",
        temperature: 0,
        maxTokens: undefined,
        maxRetries: 2,
        // other params...
      });
    default:
      throw new Error(`Unsupported provider: ${providerName}`);
  }
}
module.exports = getLLMProvider;
