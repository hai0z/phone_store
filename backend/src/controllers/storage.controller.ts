import { StorageService } from "./../services/storage.service";
import { Request, Response } from "express";

class StorageController {
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  getAllStorages = async (req: Request, res: Response) => {
    try {
      const storages = await this.storageService.getAllStorages();
      return res.json(storages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch storages" + error });
    }
  };

  getStorageById = async (req: Request, res: Response) => {
    try {
      const storageId = parseInt(req.params.id);
      const storage = await this.storageService.getStorageById(storageId);

      if (!storage) {
        return res.status(404).json({ error: "Storage not found" });
      }

      res.json(storage);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch storage" });
    }
  };

  createStorage = async (req: Request, res: Response) => {
    try {
      const storageData = req.body;
      const newStorage = await this.storageService.createStorage(storageData);
      res.status(201).json(newStorage);
    } catch (error) {
      res.status(500).json({ error: "Failed to create storage" });
    }
  };

  updateStorage = async (req: Request, res: Response) => {
    try {
      const storageId = parseInt(req.params.id);
      const storageData = req.body;
      const updatedStorage = await this.storageService.updateStorage(
        storageId,
        storageData
      );

      if (!updatedStorage) {
        return res.status(404).json({ error: "Storage not found" });
      }

      res.json(updatedStorage);
    } catch (error) {
      res.status(500).json({ error: "Failed to update storage" });
    }
  };

  deleteStorage = async (req: Request, res: Response) => {
    try {
      const storageId = parseInt(req.params.id);
      await this.storageService.deleteStorage(storageId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete storage" });
    }
  };
}

export default new StorageController();
