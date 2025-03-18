import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "./../services/db";
import redisClient from "../services/redisClient";
import authenticateToken from "../middleware/authMiddleware";
import { ChatClientManager } from "../providers/ChatClientManager";
import { RowDataPacket } from "mysql2";
import loggerService from "../services/loggerService";
import dotenv from "dotenv";
dotenv.config();

const router: Router = Router();

interface LoginRequest {
  username: string;
  password: string;
}

interface User extends RowDataPacket {
  id: number;
  username: string;
  hashed_password: string;
}

interface JwtPayload {
  id: number;
  username: string;
  exp: number;
}

// ====================
// Login Endpoint
// ====================
router.post(
  "/login",
  async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    loggerService.info("login request received" + req);
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      // Retrieve user from MySQL by username
      const [rows] = await db.execute<User[]>(
        "SELECT * FROM chat_app.users WHERE username = ?",
        [username]
      );
      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const user = rows[0];

      // Compare the provided password with the stored hashed password using bcrypt
      /*  const passwordMatch = await bcrypt.compare(
        password,
        user.hashed_password
      );
*/
      const passwordMatch = user.hashed_password === password;

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      // Generate a JWT token valid for 1 hour
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      // Create a new ChatClient for this session
      const chatClientManager = ChatClientManager.getInstance();
      chatClientManager.createClient(user.id.toString(), token);

      res.json({ token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ====================
// Logout Endpoint
// ====================
router.post("/logout", authenticateToken, (req: Request, res: Response) => {
  // Get token from Authorization header

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  loggerService.info("logout request received" + token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Remove the ChatClient for this session
  const chatClientManager = ChatClientManager.getInstance();
  chatClientManager.removeClient(token);

  // Decode the token to find its expiry time
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const payload = decoded as JwtPayload;
    // Calculate TTL (time-to-live) for the blacklist entry in seconds
    const exp = payload.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const ttl = exp - currentTime;

    // Add the token to the blacklist in Redis with the calculated TTL
    redisClient
      .set(token, "blacklisted", { EX: ttl })
      .then(() => res.json({ message: "Logged out successfully" }))
      .catch(() =>
        res.status(500).json({ message: "Error invalidating token" })
      );
  });
});

export default router;
