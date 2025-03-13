import { Router } from "express";
import ramController from "../controllers/ram.controller";

const router = Router();

router.get("/", ramController.getAllRams);
router.get("/:id", ramController.getRamById);
router.post("/", ramController.createRam);
router.put("/:id", ramController.updateRam);
router.delete("/:id", ramController.deleteRam);

export default router;
