import { Router } from "express";
import adminHomeController from "../controllers/admin-home.controller";

const router = Router();

router.get("/dashboard", adminHomeController.getDashboardData);

export default router;
