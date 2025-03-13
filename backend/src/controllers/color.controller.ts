import { ColorService } from "./../services/color.service";
import { Request, Response } from "express";
class ColorController {
  private colorService: ColorService;

  constructor() {
    this.colorService = new ColorService();
  }

  getAllColors = async (req: Request, res: Response) => {
    try {
      const colors = await this.colorService.getAllColors();
      return res.json(colors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch colors" + error });
    }
  };

  getColorById = async (req: Request, res: Response) => {
    try {
      const colorId = parseInt(req.params.id);
      const color = await this.colorService.getColorById(colorId);

      if (!color) {
        return res.status(404).json({ error: "Color not found" });
      }

      res.json(color);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch color" });
    }
  };

  createColor = async (req: Request, res: Response) => {
    try {
      const colorData = req.body;
      const newColor = await this.colorService.createColor(colorData);
      res.status(201).json(newColor);
    } catch (error) {
      res.status(500).json({ error: "Failed to create color" + error });
    }
  };

  updateColor = async (req: Request, res: Response) => {
    try {
      const colorId = parseInt(req.params.id);
      const colorData = req.body;
      const updatedColor = await this.colorService.updateColor(
        colorId,
        colorData
      );

      if (!updatedColor) {
        return res.status(404).json({ error: "Color not found" });
      }

      res.json(updatedColor);
    } catch (error) {
      res.status(500).json({ error: "Failed to update color" });
    }
  };

  deleteColor = async (req: Request, res: Response) => {
    try {
      const colorId = parseInt(req.params.id);
      await this.colorService.deleteColor(colorId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete color" });
    }
  };
}

export default new ColorController();
