import fs from "fs";
import path from "path";
import db from "../services/db";
import logger from "../services/loggerService";

async function runMigration() {
  try {
    const sqlFile = path.join(
      __dirname,
      "migrations",
      "create_action_codes_table.sql"
    );
    const sql = fs.readFileSync(sqlFile, "utf8");

    // Split the SQL file into individual statements
    const statements = sql.split(";").filter((stmt) => stmt.trim());

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await db.execute(statement);
        logger.info("Executed SQL statement successfully");
      }
    }

    logger.info("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
