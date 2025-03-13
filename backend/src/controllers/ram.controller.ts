import { RamService } from "./../services/ram.service";
import { Request, Response } from "express";

class RamController {
  private ramService: RamService;

  constructor() {
    this.ramService = new RamService();
  }

  getAllRams = async (req: Request, res: Response) => {
    try {
      const rams = await this.ramService.getAllRams();
      return res.json(rams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rams" + error });
    }
  };

  getRamById = async (req: Request, res: Response) => {
    try {
      const ramId = parseInt(req.params.id);
      const ram = await this.ramService.getRamById(ramId);

      if (!ram) {
        return res.status(404).json({ error: "Ram not found" });
      }

      res.json(ram);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ram" });
    }
  };

  createRam = async (req: Request, res: Response) => {
    try {
      const ramData = req.body;
      const newRam = await this.ramService.createRam(ramData);
      res.status(201).json(newRam);
    } catch (error) {
      res.status(500).json({ error: "Failed to create ram" });
    }
  };

  updateRam = async (req: Request, res: Response) => {
    try {
      const ramId = parseInt(req.params.id);
      const ramData = req.body;
      const updatedRam = await this.ramService.updateRam(ramId, ramData);

      if (!updatedRam) {
        return res.status(404).json({ error: "Ram not found" });
      }

      res.json(updatedRam);
    } catch (error) {
      res.status(500).json({ error: "Failed to update ram" });
    }
  };

  deleteRam = async (req: Request, res: Response) => {
    try {
      const ramId = parseInt(req.params.id);
      await this.ramService.deleteRam(ramId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete ram" });
    }
  };
}

export default new RamController();
