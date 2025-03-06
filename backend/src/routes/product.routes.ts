import { Router } from "express";
import productController from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", productController.getAllProducts);
router.get("/filter", productController.filterProducts);
router.get("/filter-options", productController.getFilterOptions);
router.get("/:id", productController.getProductById);
router.get("/:id/variants", productController.getProductVariants);

// Admin only routes
router.post("/", authMiddleware(["admin"]), productController.createProduct);
router.put("/:id", authMiddleware(["admin"]), productController.updateProduct);
router.delete(
  "/:id",
  authMiddleware(["admin"]),
  productController.deleteProduct
);

export default router;
