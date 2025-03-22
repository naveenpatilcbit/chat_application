import { Request, Response, RequestHandler } from "express";
import db from "../services/db";
import logger from "../services/loggerService";
import { ActionCode, IActionCode } from "../models/ActionCode";
import endpointsInfo from "../services/endpointsInfo";

export class ActionCodeController {
  create: RequestHandler = async (req, res) => {
    try {
      const { name, description } = req.body;
      const [result] = await db.execute(
        "INSERT INTO action_codes (name, description) VALUES (?, ?)",
        [name, description]
      );

      logger.info("Action code created:", { name, description });
      res.status(201).json({
        message: "Action code created successfully",
        id: (result as any).insertId,
      });
    } catch (error) {
      logger.error("Error creating action code:", error);
      res.status(500).json({ error: "Failed to create action code" });
    }
  };

  listAllMethods: RequestHandler = async (req, res) => {
    try {
      logger.info("Listing all methods");
      res.status(201).json(endpointsInfo);
    } catch (error) {
      logger.error("Error creating action code:", error);
      res.status(500).json({ error: "Failed to create action code" });
    }
  };

  getAll: RequestHandler = async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM action_codes");
      res.json(rows);
    } catch (error) {
      logger.error("Error fetching action codes:", error);
      res.status(500).json({ error: "Failed to fetch action codes" });
    }
  };

  getById: RequestHandler = async (req, res) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM action_codes WHERE id = ?",
        [req.params.id]
      );
      const actionCodes = rows as IActionCode[];

      if (actionCodes.length === 0) {
        res.status(404).json({ message: "Action code not found" });
        return;
      }

      res.json(actionCodes[0]);
    } catch (error) {
      logger.error("Error fetching action code:", error);
      res.status(500).json({ error: "Failed to fetch action code" });
    }
  };

  update: RequestHandler = async (req, res) => {
    try {
      const { name, description } = req.body;
      const [result] = await db.execute(
        "UPDATE action_codes SET name = ?, description = ?, updatedAt = NOW() WHERE id = ?",
        [name, description, req.params.id]
      );

      if ((result as any).affectedRows === 0) {
        res.status(404).json({ message: "Action code not found" });
        return;
      }

      res.json({ message: "Action code updated successfully" });
    } catch (error) {
      logger.error("Error updating action code:", error);
      res.status(500).json({ error: "Failed to update action code" });
    }
  };

  delete: RequestHandler = async (req, res) => {
    try {
      const [result] = await db.execute(
        "UPDATE action_codes SET isActive = false, updatedAt = NOW() WHERE id = ?",
        [req.params.id]
      );

      if ((result as any).affectedRows === 0) {
        res.status(404).json({ message: "Action code not found" });
        return;
      }

      res.json({ message: "Action code deleted successfully" });
    } catch (error) {
      logger.error("Error deleting action code:", error);
      res.status(500).json({ error: "Failed to delete action code" });
    }
  };
}

export default new ActionCodeController();
