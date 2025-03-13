import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

// Admin login route
router.post("/admin/login", authController.adminLogin);

// Customer login route
router.post("/customer/login", authController.customerLogin);
// Customer registration route
router.post("/customer/register", authController.customerRegister);

// Token validation route
router.get("/validate", authController.validateToken);

export default router;
