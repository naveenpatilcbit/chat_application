import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import authenticateToken from "./middleware/authMiddleware";
import loginEndpoints from "./controllers/logincontroller";
import messagesEndpoints from "./controllers/chat";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const PORT: number = 5001;

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("responding...");
  res.header("Access-Control-Allow-Origin", "*"); // Allow any origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow all methods
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Intercept OPTIONS method and respond with 200 (OK)
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// If you have public routes (e.g., login, register), you can exclude them:
app.use((req: Request, res: Response, next: NextFunction): void => {
  // Array of public paths that don't require authentication
  const publicPaths: string[] = ["/login", "/register"];
  if (publicPaths.includes(req.path)) {
    return next();
  }
  // For all other routes, ensure authentication
  authenticateToken(req, res, next);
});

app.use("/", messagesEndpoints);
app.use("/", loginEndpoints);

app.listen(PORT, () => {
  console.log(`ChatApp Middleware running at http://localhost:${PORT}`);
});
