import dotenv from "dotenv";
dotenv.config();

export default {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "my-secret-pw",
  database: process.env.DB_NAME || "chat_app",
  port: parseInt(process.env.DB_PORT || "3306"),
};
