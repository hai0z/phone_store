import { Request, Response } from "express";
import { RatingService } from "../services/rating.service";

class RatingController {
  private ratingService: RatingService;

  constructor() {
    this.ratingService = new RatingService();
  }

  addRating = async (req: Request, res: Response) => {
    try {
      const { productId, rating, customerId, content } = req.body;

      if (!customerId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await this.ratingService.addRating(
        productId,
        customerId,
        rating,
        content
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error adding rating", error });
    }
  };

  getProductRatings = async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      const ratings = await this.ratingService.getProductRatings(productId);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching ratings", error });
    }
  };
}

export default new RatingController();
