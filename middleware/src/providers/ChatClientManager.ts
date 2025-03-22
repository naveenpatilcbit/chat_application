import { ChatClient } from "../models/ChatClient";
import logger from "../services/loggerService";
export class ChatClientManager {
  private static instance: ChatClientManager;
  private clients: Map<string, ChatClient>;

  private constructor() {
    this.clients = new Map();
  }

  public static getInstance(): ChatClientManager {
    if (!ChatClientManager.instance) {
      ChatClientManager.instance = new ChatClientManager();
    }
    return ChatClientManager.instance;
  }

  public createClient(userId: string, sessionId: string): ChatClient {
    const client = new ChatClient("default", {});
    client.initializeSession(userId, sessionId);
    this.clients.set(sessionId, client);
    return client;
  }

  public getClient(sessionId: string): ChatClient | undefined {
    logger.info("Getting client for sessionId:" + this.clients);
    return this.clients.get(sessionId);
  }

  public removeClient(sessionId: string): void {
    this.clients.delete(sessionId);
  }

  public hasClient(sessionId: string): boolean {
    return this.clients.has(sessionId);
  }
}
