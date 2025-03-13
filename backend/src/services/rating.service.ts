import { BaseService } from "./base.service";

export class RatingService extends BaseService {
  // Rating methods
  async addRating(productId: number, customerId: number, rating: number) {
    // Check if user already rated this product
    const existingRating = await this.prisma.ratings.findFirst({
      where: {
        product_id: productId,
        customer_id: customerId,
      },
    });

    if (existingRating) {
      // Update existing rating
      return this.prisma.ratings.update({
        where: { rating_id: existingRating.rating_id },
        data: { rating },
      });
    }

    // Create new rating
    return this.prisma.ratings.create({
      data: {
        product_id: productId,
        customer_id: customerId,
        rating,
      },
    });
  }

  async getProductRatings(productId: number) {
    const ratings = await this.prisma.ratings.findMany({
      where: { product_id: productId },
      include: {
        customer: {
          select: {
            customer_id: true,
            full_name: true,
          },
        },
      },
    });

    const averageRating =
      ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length || 0;

    const ratingDistribution = await this.prisma.ratings.groupBy({
      by: ["rating"],
      where: { product_id: productId },
      _count: true,
    });

    return {
      ratings,
      averageRating,
      totalRatings: ratings.length,
      distribution: ratingDistribution,
    };
  }
}
