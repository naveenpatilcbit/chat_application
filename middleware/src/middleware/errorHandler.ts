import { Request, Response, NextFunction } from "express";
import { APIError } from "../types/interfaces";
import logger from "../services/loggerService";

export class HttpError extends Error implements APIError {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const errorHandler = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error occurred:", err);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details,
    });
  }

  // Handle specific error types
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      details: err.message,
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Unauthorized",
      details: err.message,
    });
  }

  // Default error
  return res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
};

// Middleware to handle async errors
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
