import { BaseService } from "./base.service";
import { Brands } from "@prisma/client";

export class BrandService extends BaseService {
  async getAllBrands() {
    return this.prisma.brands.findMany();
  }

  async getBrandById(brandId: number) {
    return this.prisma.brands.findUnique({
      where: { brand_id: brandId },
    });
  }

  async createBrand(data: Omit<Brands, "brand_id">) {
    return this.prisma.brands.create({
      data,
    });
  }

  async updateBrand(brandId: number, data: Partial<Brands>) {
    return this.prisma.brands.update({
      where: { brand_id: brandId },
      data,
    });
  }

  async deleteBrand(brandId: number) {
    return this.prisma.brands.delete({
      where: { brand_id: brandId },
    });
  }
}
