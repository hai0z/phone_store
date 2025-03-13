import { Request, Response } from "express";
import { CategoryService } from "../services/categories.service";

class CategoriesController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await this.categoryService.getCategoryById(categoryId);

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  };

  createCategory = async (req: Request, res: Response) => {
    try {
      const categoryData = req.body;
      const newCategory = await this.categoryService.createCategory(
        categoryData
      );
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      const categoryData = req.body;
      const updatedCategory = await this.categoryService.updateCategory(
        categoryId,
        categoryData
      );

      if (!updatedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: "Failed to update category" });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      await this.categoryService.deleteCategory(categoryId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  };
}

export default new CategoriesController();
