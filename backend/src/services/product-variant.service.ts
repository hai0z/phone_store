import { BaseService } from "./base.service";
import { ProductVariants } from "@prisma/client";

export class ProductVariantService extends BaseService {
  async getVariantById(variantId: number) {
    return this.prisma.productVariants.findUnique({
      where: { variant_id: variantId },
      include: {
        product: true,
        ram: true,
        color: true,
        storage: true,
      },
    });
  }

  async getVariantsByProductId(productId: number) {
    return this.prisma.productVariants.findMany({
      where: { product_id: productId },
      include: {
        color: true,
        storage: true,
        ram: true,
      },
    });
  }

  async createVariant(data: Omit<ProductVariants, "variant_id">) {
    return this.prisma.productVariants.create({
      data,
      include: {
        color: true,
        storage: true,
        ram: true,
      },
    });
  }

  async updateVariant(variantId: number, data: Partial<ProductVariants>) {
    return this.prisma.productVariants.update({
      where: { variant_id: variantId },
      data,
      include: {
        color: true,
        storage: true,
      },
    });
  }

  async deleteVariant(variantId: number) {
    return this.prisma.productVariants.delete({
      where: { variant_id: variantId },
    });
  }

  async updateStock(variantId: number, quantity: number) {
    return this.prisma.productVariants.update({
      where: { variant_id: variantId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }

  async checkAvailability(variantId: number, quantity: number) {
    const variant = await this.prisma.productVariants.findUnique({
      where: { variant_id: variantId },
    });

    if (!variant) {
      throw new Error("Variant not found");
    }

    return variant.stock >= quantity;
  }

  async getVariantsByFilters({
    productId,
    colorId,
    storageId,
    inStock = true,
  }: {
    productId?: number;
    colorId?: number;
    storageId?: number;
    inStock?: boolean;
  }) {
    return this.prisma.productVariants.findMany({
      where: {
        product_id: productId,
        color_id: colorId,
        storage_id: storageId,
        ...(inStock && { stock: { gt: 0 } }),
      },
      include: {
        color: true,
        storage: true,
        product: true,
      },
    });
  }
}
