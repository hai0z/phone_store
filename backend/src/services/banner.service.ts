import { BaseService } from "./base.service";
import { Banners, BannerImages } from "@prisma/client";

export class BannerService extends BaseService {
  async getAllBanners() {
    return this.prisma.banners.findMany({
      include: {
        images: true,
      },
    });
  }

  async getBannerById(bannerId: number) {
    return this.prisma.banners.findUnique({
      where: { banner_id: bannerId },
      include: {
        images: true,
      },
    });
  }

  async createBanner(
    bannerData: Omit<Banners, "banner_id" | "created_at" | "updated_at">
  ) {
    return this.prisma.banners.create({
      data: bannerData,
    });
  }

  async updateBanner(
    bannerId: number,
    bannerData: Partial<
      Omit<Banners, "banner_id" | "created_at" | "updated_at">
    >
  ) {
    return this.prisma.banners.update({
      where: { banner_id: bannerId },
      data: bannerData,
    });
  }

  async deleteBanner(bannerId: number) {
    return this.prisma.banners.delete({
      where: { banner_id: bannerId },
    });
  }

  // Banner Images
  async addBannerImage(data: Omit<BannerImages, "image_id" | "created_at">) {
    return this.prisma.bannerImages.create({
      data,
    });
  }

  async updateBannerImage(
    imageId: number,
    data: Partial<Omit<BannerImages, "image_id" | "created_at">>
  ) {
    return this.prisma.bannerImages.update({
      where: { image_id: imageId },
      data,
    });
  }

  async deleteBannerImage(imageId: number) {
    return this.prisma.bannerImages.delete({
      where: { image_id: imageId },
    });
  }

  async getBannerImages(bannerId: number) {
    return this.prisma.bannerImages.findMany({
      where: { banner_id: bannerId },
    });
  }

  // Get active banners for frontend display
  async getActiveBanners() {
    const now = new Date();
    return this.prisma.banners.findMany({
      where: {
        is_active: true,
        AND: [
          {
            OR: [{ start_date: null }, { start_date: { lte: now } }],
          },
          {
            OR: [{ end_date: null }, { end_date: { gte: now } }],
          },
        ],
      },
      include: {
        images: true,
      },
      orderBy: { created_at: "asc" },
    });
  }
}
