import winston from "winston";
import { format } from "winston";

class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
      defaultMeta: { service: "chat-service" },
      transports: [
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
        }),
        new winston.transports.File({ filename: "logs/combined.log" }),
      ],
    });

    // If we're not in production, log to console as well
    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        })
      );
    }
  }

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error, meta?: any) {
    this.logger.error(message, { error, ...meta });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  // Method for tracking API calls
  logAPICall(
    method: string,
    endpoint: string,
    duration: number,
    status: number
  ) {
    this.logger.info("API Call", {
      method,
      endpoint,
      duration,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  // Method for tracking LLM operations
  logLLMOperation(operation: string, tokens: number, duration: number) {
    this.logger.info("LLM Operation", {
      operation,
      tokens,
      duration,
      timestamp: new Date().toISOString(),
    });
  }
}

export default new LoggerService();
