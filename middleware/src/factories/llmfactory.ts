type LLMProvider = "openai" | "anthropic";

/**
 * Returns an instance of the LLM based on the provider name.
 * @param providerName - The name of the provider ("openai" or "anthropic").
 * @returns An instance of the LLM.
 */
function getLLMProvider(providerName: LLMProvider): any {
  switch (providerName.toLowerCase()) {
    case "openai":
      return "openai-modle";
    case "anthropic":
      return "anthropic-model";
    default:
      throw new Error(`Unsupported provider: ${providerName}`);
  }
}

module.exports = getLLMProvider;
