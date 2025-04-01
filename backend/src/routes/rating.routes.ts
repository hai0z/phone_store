import { Router } from "express";
import ratingController from "../controllers/rating.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Protected routes (require authentication)
router.post("/", ratingController.addRating);
router.get("/product/:productId", ratingController.getProductRatings);

export default router;
