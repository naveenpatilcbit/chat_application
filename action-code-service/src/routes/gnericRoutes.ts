import { Router } from "express";
import actionCodeController from "../controllers/actionCodeController";

const router = Router();
router.get("/list-all-methods", actionCodeController.listAllMethods);

export default router;
