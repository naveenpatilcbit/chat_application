// conversationService.js
const { ConversationChain } = require("langchain/chains");
const { BufferMemory } = require("langchain/memory");
const getLLMProvider = require("./../factories/llmfactory");

/**
 * Processes a chat message using a selected LLM provider while maintaining context.
 * @param {string} provider - The provider name ("openai" or "anthropic").
 * @param {string} input - The user's message.
 * @param {BufferMemory} [memory] - Optional existing memory for context.
 * @returns {Promise<string>} - The response from the LLM.
 */
async function processChat(provider, input, memory = new BufferMemory()) {
  // Get the appropriate LLM instance.
  const llm = getLLMProvider(provider);

  // Create a conversation chain using the selected LLM and provided memory.
  const conversationChain = new ConversationChain({ llm, memory });

  // Invoke the chain with the user input.
  const response = await conversationChain.call({ input });

  // Return the LLM's response.
  return response.response;
}

module.exports = { processChat };
