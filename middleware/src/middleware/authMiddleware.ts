// authMiddleware.js
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import redisClient from "../services/redisClient";

interface JwtPayload {
  userId: string;
  email: string;
  [key: string]: any;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Retrieve token from the Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    // Check if the token is blacklisted in Redis
    const isBlacklisted = await redisClient.get(token);

    if (isBlacklisted === "blacklisted") {
      res.status(401).json({ message: "Token has been invalidated" });
      return;
    }

    // Verify the token
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authenticateToken;
