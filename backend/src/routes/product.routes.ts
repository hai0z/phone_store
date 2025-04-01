import { Router } from "express";
import productController from "../controllers/product.controller";

const router = Router();

// Public routes
router.get("/suggestions", productController.getSuggestions);

router.get("/", productController.getAllProducts);
router.get("/filter", productController.filterProducts);
router.get("/filter-options", productController.getFilterOptions);
router.get("/:id", productController.getProductById);
router.get("/:id/variants", productController.getProductVariants);
// Admin only routes
router.post("/", productController.createProduct);
router.post("/:id/images", productController.createProductImages);
router.post("/variants", productController.createProductVariants);

router.put("/:id", productController.updateProduct);
router.put("/variants/:id", productController.updateProductVariant);

router.delete("/:id", productController.deleteProduct);
router.delete("/images/:id", productController.deleteProductImages);
router.delete("/variants/:id", productController.deleteProductVariants);

export default router;
