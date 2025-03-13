import { Router } from "express";
import categoriesController from "../controllers/categories.controller";

const router = Router();

// Get all categories
router.get("/", categoriesController.getAllCategories);

// Get category by ID
router.get("/:id", categoriesController.getCategoryById);

// Create new category
router.post("/", categoriesController.createCategory);

// Update category
router.put("/:id", categoriesController.updateCategory);

// Delete category
router.delete("/:id", categoriesController.deleteCategory);

export default router;
