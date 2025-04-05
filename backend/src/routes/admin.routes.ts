import { Router } from "express";
import adminController from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware(["admin"]),
  adminController.getDashboardData
);

// Admin profile routes
router.get("/:id", authMiddleware(["admin"]), adminController.getAdminById);
router.put(
  "/:id",
  authMiddleware(["admin"]),
  adminController.updateAdminProfile
);
router.put(
  "/:id/password",
  authMiddleware(["admin"]),
  adminController.changeAdminPassword
);

export default router;
