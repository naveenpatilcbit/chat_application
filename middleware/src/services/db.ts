import mysql from "mysql2/promise";
import { Pool, PoolOptions } from "mysql2/promise";

interface DatabaseConfig extends PoolOptions {
  host: string;
  user: string;
  password: string;
  database: string;
}

const config: DatabaseConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "my-secret-pw",
  database: process.env.MYSQL_DATABASE || "chat_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create a connection pool for better performance and scalability
const pool: Pool = mysql.createPool(config);

export default pool;
