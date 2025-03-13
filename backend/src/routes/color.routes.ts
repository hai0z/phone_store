import { Router } from "express";
import colorController from "../controllers/color.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", colorController.getAllColors);
router.get("/:id", colorController.getColorById);

// Protected routes - only admin can modify colors
router.post("/", colorController.createColor);
router.put("/:id", authMiddleware(["admin"]), colorController.updateColor);
router.delete("/:id", authMiddleware(["admin"]), colorController.deleteColor);

export default router;
