// llmFactory.js
const { OpenAI } = require("langchain/llms/openai");
const { Anthropic } = require("langchain/llms/anthropic");

/**
 * Returns an instance of the LLM based on the provider name.
 * @param {string} providerName - The name of the provider ("openai" or "anthropic").
 * @returns {object} - An instance of the LLM.
 */
function getLLMProvider(providerName) {
  switch (providerName.toLowerCase()) {
    case "openai":
      return new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-4", // or 'gpt-3.5-turbo'
      });
    case "anthropic":
      return new Anthropic({
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        modelName: "claude-v1", // example model name
      });
    default:
      throw new Error(`Unsupported provider: ${providerName}`);
  }
}

module.exports = getLLMProvider;
