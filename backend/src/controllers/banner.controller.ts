import { Request, Response } from "express";
import { BannerService } from "../services/banner.service";

export class BannerController {
  private bannerService: BannerService;

  constructor() {
    this.bannerService = new BannerService();
  }

  // Banner CRUD
  getAllBanners = async (req: Request, res: Response) => {
    try {
      const banners = await this.bannerService.getAllBanners();
      res.json(banners);
    } catch (error: any) {
      res.status(500).json({
        message: "Error fetching banners",
        error: error.message,
      });
    }
  };

  getBannerById = async (req: Request, res: Response) => {
    try {
      const bannerId = parseInt(req.params.id);
      const banner = await this.bannerService.getBannerById(bannerId);

      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      res.json(banner);
    } catch (error: any) {
      res.status(500).json({
        message: "Error fetching banner",
        error: error.message,
      });
    }
  };

  createBanner = async (req: Request, res: Response) => {
    try {
      const bannerData = req.body;
      const newBanner = await this.bannerService.createBanner(bannerData);
      res.status(201).json(newBanner);
    } catch (error: any) {
      res.status(500).json({
        message: "Error creating banner",
        error: error.message,
      });
    }
  };

  updateBanner = async (req: Request, res: Response) => {
    try {
      const bannerId = parseInt(req.params.id);
      const bannerData = req.body;
      const updatedBanner = await this.bannerService.updateBanner(
        bannerId,
        bannerData
      );
      res.json(updatedBanner);
    } catch (error: any) {
      res.status(500).json({
        message: "Error updating banner",
        error: error.message,
      });
    }
  };

  deleteBanner = async (req: Request, res: Response) => {
    try {
      const bannerId = parseInt(req.params.id);
      await this.bannerService.deleteBanner(bannerId);
      res.json({ message: "Banner deleted successfully" });
    } catch (error: any) {
      res.status(500).json({
        message: "Error deleting banner",
        error: error.message,
      });
    }
  };

  // Banner Images
  getBannerImages = async (req: Request, res: Response) => {
    try {
      const bannerId = parseInt(req.params.id);
      const images = await this.bannerService.getBannerImages(bannerId);
      res.json(images);
    } catch (error: any) {
      res.status(500).json({
        message: "Error fetching banner images",
        error: error.message,
      });
    }
  };

  addBannerImage = async (req: Request, res: Response) => {
    try {
      const imageData = req.body;
      const newImage = await this.bannerService.addBannerImage(imageData);
      res.status(201).json(newImage);
    } catch (error: any) {
      res.status(500).json({
        message: "Error adding banner image",
        error: error.message,
      });
    }
  };

  updateBannerImage = async (req: Request, res: Response) => {
    try {
      const imageId = parseInt(req.params.imageId);
      const imageData = req.body;
      const updatedImage = await this.bannerService.updateBannerImage(
        imageId,
        imageData
      );
      res.json(updatedImage);
    } catch (error: any) {
      res.status(500).json({
        message: "Error updating banner image",
        error: error.message,
      });
    }
  };

  deleteBannerImage = async (req: Request, res: Response) => {
    try {
      const imageId = parseInt(req.params.imageId);
      await this.bannerService.deleteBannerImage(imageId);
      res.json({ message: "Banner image deleted successfully" });
    } catch (error: any) {
      res.status(500).json({
        message: "Error deleting banner image",
        error: error.message,
      });
    }
  };

  // Get active banners for frontend
  getActiveBanners = async (req: Request, res: Response) => {
    try {
      const activeBanners = await this.bannerService.getActiveBanners();
      res.json(activeBanners);
    } catch (error: any) {
      res.status(500).json({
        message: "Error fetching active banners",
        error: error.message,
      });
    }
  };
}

export default new BannerController();
