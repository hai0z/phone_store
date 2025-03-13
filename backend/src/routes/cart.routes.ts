import { Router } from "express";
import { CartController } from "../controllers/cart.controller";

const router = Router();
const cartController = new CartController();

router.post("/sync", cartController.syncCart);

export default router;
