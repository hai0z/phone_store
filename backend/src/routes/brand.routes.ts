import { Router } from "express";
import brandController from "../controllers/brand.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", brandController.getAllBrands);
router.get("/:id", brandController.getBrandById);

// Protected routes (admin only)
router.post("/", brandController.createBrand);
router.put("/:id", brandController.updateBrand);
router.delete("/:id", brandController.deleteBrand);

export default router;
