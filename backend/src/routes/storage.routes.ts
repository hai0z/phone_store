import { Router } from "express";
import storageController from "../controllers/storage.controller";

const router = Router();

router.get("/", storageController.getAllStorages);
router.get("/:id", storageController.getStorageById);
router.post("/", storageController.createStorage);
router.put("/:id", storageController.updateStorage);
router.delete("/:id", storageController.deleteStorage);

export default router;
