import { BaseService } from "./base.service";
import { ProductImages, Products, ProductVariants } from "@prisma/client";

export class ProductService extends BaseService {
  async getAllProducts() {
    return this.prisma.products.findMany({
      include: {
        category: true,
        brand: true,
        variants: true,
        ratings: true,
        images: true,
      },
    });
  }

  async getProductById(productId: number) {
    return this.prisma.products.findUnique({
      where: { product_id: productId },
      include: {
        category: true,
        brand: true,
        images: {
          include: {
            color: true,
          },
        },
        variants: {
          include: {
            color: true,
            storage: true,
            ram: true,
          },
        },

        ratings: true,
      },
    });
  }

  async getProductImages(imageId: number) {
    return this.prisma.productImages.findUnique({
      where: { image_id: imageId },
    });
  }

  async createProduct(product: Omit<Products, "product_id">) {
    return this.prisma.products.create({
      data: product,
    });
  }

  async createProductImages(images: Omit<ProductImages, "image_id">[]) {
    return this.prisma.productImages.createMany({
      data: images,
    });
  }

  async createProductVariants(variants: Omit<ProductVariants, "variant_id">[]) {
    return this.prisma.productVariants.createMany({
      data: variants,
    });
  }
  async updateProduct(productId: number, data: Partial<Products>) {
    return this.prisma.products.update({
      where: { product_id: productId },
      data,
    });
  }

  async updateProductVariants(
    variantId: number,
    data: Partial<ProductVariants>
  ) {
    return this.prisma.productVariants.update({
      where: { variant_id: variantId },
      data,
    });
  }

  async deleteProduct(productId: number) {
    return this.prisma.products.delete({
      where: { product_id: productId },
    });
  }

  async deleteProductImages(imageId: number) {
    return this.prisma.productImages.delete({
      where: { image_id: imageId },
    });
  }

  async deleteProductVariants(variantId: number) {
    return this.prisma.productVariants.delete({
      where: { variant_id: variantId },
    });
  }
}
