import { BaseService } from "./base.service";
import { Comments, Ratings } from "@prisma/client";

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

  // Comment methods
  async addComment(productId: number, customerId: number, content: string) {
    return this.prisma.comments.create({
      data: {
        product_id: productId,
        customer_id: customerId,
        content,
      },
      include: {
        customer: {
          select: {
            customer_id: true,
            full_name: true,
          },
        },
      },
    });
  }

  async getProductComments(
    productId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const total = await this.prisma.comments.count({
      where: { product_id: productId },
    });

    const comments = await this.prisma.comments.findMany({
      where: { product_id: productId },
      include: {
        customer: {
          select: {
            customer_id: true,
            full_name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateComment(commentId: number, content: string) {
    return this.prisma.comments.update({
      where: { comment_id: commentId },
      data: { content },
    });
  }

  async deleteComment(commentId: number) {
    return this.prisma.comments.delete({
      where: { comment_id: commentId },
    });
  }

  // Combined stats
  async getProductFeedbackStats(productId: number) {
    const [ratings, comments] = await Promise.all([
      this.getProductRatings(productId),
      this.prisma.comments.count({
        where: { product_id: productId },
      }),
    ]);

    return {
      ratings: {
        average: ratings.averageRating,
        total: ratings.totalRatings,
        distribution: ratings.distribution,
      },
      totalComments: comments,
    };
  }
}
