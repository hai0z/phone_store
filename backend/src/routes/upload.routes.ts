import { Router } from "express";
import uploadController from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Route for uploading a single image
router.post(
  "/image",
  // authMiddleware(["admin", "customer"]),
  uploadController.uploadImage
);

// Route for uploading multiple images
router.post(
  "/images",
  // authMiddleware(["admin"]),
  uploadController.uploadMultipleImages
);

export default router;
