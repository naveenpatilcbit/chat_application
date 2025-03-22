import mysql from "mysql2/promise";
import dbConfig from "../config/db.config";
import logger from "./loggerService";

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool
  .getConnection()
  .then((connection) => {
    logger.info("Successfully connected to the database.");
    connection.release();
  })
  .catch((err) => {
    logger.error("Error connecting to the database:", err);
  });

export default pool;
