import { Router } from "express";
import actionCodeController from "../controllers/actionCodeController";

const router = Router();
router.get("/list-all-methods", actionCodeController.listAllMethods);
router.post("/", actionCodeController.create);

router.get("/", actionCodeController.getAll);
router.get("/:id", actionCodeController.getById);
router.put("/:id", actionCodeController.update);
router.delete("/:id", actionCodeController.delete);

export default router;
