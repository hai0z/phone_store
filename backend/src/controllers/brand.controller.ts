import { Request, Response } from "express";
import { BrandService } from "../services/brand.service";
import { UploadService } from "../services/upload.service";

export class BrandController {
  private brandService: BrandService;
  private uploadService: UploadService;

  constructor() {
    this.brandService = new BrandService();
    this.uploadService = new UploadService();
  }

  getAllBrands = async (req: Request, res: Response) => {
    try {
      const brands = await this.brandService.getAllBrands();
      res.json(brands);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching brands", error: error.message });
    }
  };

  getBrandById = async (req: Request, res: Response) => {
    try {
      const brandId = Number(req.params.id);
      const brand = await this.brandService.getBrandById(brandId);

      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }

      res.json(brand);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching brand", error: error.message });
    }
  };

  createBrand = async (req: Request, res: Response) => {
    try {
      // Use multer upload middleware
      const upload = this.uploadService.upload.single("image");

      upload(req, res, async (err: any) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        const { brand_name } = req.body;

        if (!brand_name) {
          // If file was uploaded but brand_name is missing, delete the file
          if (req.file) {
            // You might want to implement a method to delete the file
          }
          return res.status(400).json({ message: "Brand name is required" });
        }

        // Create brand data object
        const brandData: any = { brand_name };

        // If logo was uploaded, add the URL to brand data
        if (req.file) {
          const fileInfo = this.uploadService.processUploadedFile(req.file);
          brandData.image_url = fileInfo.url;
        }

        // Create brand in database
        const brand = await this.brandService.createBrand(brandData);
        res.status(201).json(brand);
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating brand", error: error.message });
    }
  };

  updateBrand = async (req: Request, res: Response) => {
    try {
      // Use multer upload middleware with "image" field name to match create method
      const upload = this.uploadService.upload.single("image");

      upload(req, res, async (err: any) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        const brandId = Number(req.params.id);
        const { brand_name } = req.body;

        if (!brand_name) {
          return res.status(400).json({ message: "Brand name is required" });
        }

        // Create brand data object
        const brandData: any = { brand_name };

        // If image was uploaded, add the URL to brand data
        if (req.file) {
          const fileInfo = this.uploadService.processUploadedFile(req.file);
          brandData.image_url = fileInfo.url; // Use image_url to match create method
        }

        // Update brand in database
        const brand = await this.brandService.updateBrand(brandId, brandData);
        res.json(brand);
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error updating brand", error: error.message });
    }
  };

  deleteBrand = async (req: Request, res: Response) => {
    try {
      const brandId = Number(req.params.id);

      // Get brand details before deleting to get the image filename
      const brand = await this.brandService.getBrandById(brandId);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }

      // Delete brand from database
      await this.brandService.deleteBrand(brandId);

      // Delete associated image file if exists
      if (brand.image_url) {
        const filename = brand.image_url.split("/").pop(); // Get filename from URL
        if (filename) {
          this.uploadService.deleteFile(filename);
        }
      }

      res.json({ message: "Brand deleted successfully" });
    } catch (error: any) {
      if (error.code === "P2003") {
        return res.status(400).json({
          message:
            "Cannot delete brand because it has related products. Remove those products first.",
        });
      }
      res
        .status(500)
        .json({ message: "Error deleting brand", error: error.message });
    }
  };
}

export default new BrandController();
