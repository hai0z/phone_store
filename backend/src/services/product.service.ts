import { BaseService } from "./base.service";
import { Products } from "@prisma/client";

export class ProductService extends BaseService {
  async getAllProducts() {
    return this.prisma.products.findMany({
      include: {
        category: true,
        brand: true,
        variants: true,
      },
    });
  }

  async getProductById(productId: number) {
    return this.prisma.products.findUnique({
      where: { product_id: productId },
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            color: true,
            storage: true,
          },
        },
        comments: {
          include: {
            customer: true,
          },
        },
        ratings: true,
      },
    });
  }

  async createProduct(data: Omit<Products, "product_id">) {
    return this.prisma.products.create({
      data,
    });
  }

  async updateProduct(productId: number, data: Partial<Products>) {
    return this.prisma.products.update({
      where: { product_id: productId },
      data,
    });
  }

  async deleteProduct(productId: number) {
    return this.prisma.products.delete({
      where: { product_id: productId },
    });
  }
}
