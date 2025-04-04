import { Router } from "express";
import bannerController from "../controllers/banner.controller";

const router = Router();

// Public routes
router.get("/active", bannerController.getActiveBanners);

// Protected routes (admin only)
router.get("/", bannerController.getAllBanners);
router.get("/:id", bannerController.getBannerById);
router.post("/", bannerController.createBanner);
router.put("/:id", bannerController.updateBanner);
router.delete("/:id", bannerController.deleteBanner);

// Banner images routes
router.get("/:id/images", bannerController.getBannerImages);
router.post("/images", bannerController.addBannerImage);
router.put("/images/:imageId", bannerController.updateBannerImage);
router.delete("/images/:imageId", bannerController.deleteBannerImage);

export default router;
