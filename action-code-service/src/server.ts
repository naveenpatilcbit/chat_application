import express from "express";
import actionCodeRoutes from "./routes/actionCodeRoutes";
import logger from "./services/loggerService";
import genericListRoutes from "./routes/gnericRoutes";
const app = express();

// Port configuration
// To change the port:
// 1. Set PORT environment variable: PORT=3001 npm start
// 2. Or modify the default port below
const port = process.env.PORT || 5002;

app.use(express.json());

// Routes
app.use("/api/action-codes", actionCodeRoutes);
app.use("/api/", genericListRoutes);
// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
