import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  syncCart = async (req: Request, res: Response) => {
    try {
      const cartItems = req.body;
      const syncedItems = await this.cartService.syncWithServer(cartItems);
      res.json(syncedItems);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "An error occurred while syncing cart",
      });
    }
  };
}
