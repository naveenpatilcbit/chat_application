import { createClient, RedisClientOptions } from "redis";

interface RedisConfig {
  host: string;
  port: number;
}

const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
};

const clientOptions: RedisClientOptions = {
  socket: {
    host: redisConfig.host,
    port: redisConfig.port,
  },
};

const client = createClient(clientOptions);

client.on("error", (error: Error) => {
  console.error("Redis connection error:", error);
});

client.on("connect", () => {
  console.log("Successfully connected to Redis");
});

// Connect to Redis
client.connect().catch((error: Error) => {
  console.error("Failed to connect to Redis:", error);
  process.exit(1);
});

// Helper function for backward compatibility
const get = async (key: string): Promise<string | null> => {
  return await client.get(key);
};

export { get };
export default client;
