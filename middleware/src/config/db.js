// db.js
const mysql = require("mysql2");

// Create a connection pool for better performance and scalability
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Use promise wrapper for async/await usage
module.exports = pool.promise();
