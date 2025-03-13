import { Request, Response } from "express";
import {
  ProductService,
  FilterService,
  ProductVariantService,
  UploadService,
} from "../services";
import { ProductImages, Products, ProductVariants } from "@prisma/client";

export class ProductController {
  private productService: ProductService;
  private filterService: FilterService;
  private variantService: ProductVariantService;
  private uploadService: UploadService;

  constructor() {
    this.productService = new ProductService();
    this.filterService = new FilterService();
    this.variantService = new ProductVariantService();
    this.uploadService = new UploadService();
  }

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching products", error: error.message });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const product = await this.productService.getProductById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching product", error: error.message });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const productData: Products = req.body.product;
      const product = await this.productService.createProduct(productData);
      return res.json(product);
    } catch (error: any) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error creating product", error: error.message });
    }
  };

  createProductImages = async (req: Request, res: Response) => {
    try {
      const upload = this.uploadService.upload.array("image");
      const productId = req.params.id;

      upload(req, res, async (err: any) => {
        if (err) {
          return res.status(400).json({ message: err });
        }

        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const files = Array.isArray(req.files)
          ? req.files.map((file) =>
              this.uploadService.processUploadedFile(file)
            )
          : [];
        const color_id = req.body.color_id;

        const productImages = files.map((file) => ({
          product_id: Number(productId),
          image_url: file.url,
          color_id: Number(color_id),
        }));

        await this.productService.createProductImages(
          productImages as ProductImages[]
        );

        return res.status(200).json(productImages);
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating product", error: error.message });
    }
  };
  createProductVariants = async (req: Request, res: Response) => {
    try {
      const variants: Omit<ProductVariants, "variants_id">[] = req.body;
      await this.productService.createProductVariants(variants);

      res
        .status(201)
        .json({ message: "Product variants created successfully" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating product", error: error.message });
    }
  };
  updateProduct = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const product = await this.productService.updateProduct(
        productId,
        req.body
      );
      res.json(product);
    } catch (error: any) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error updating product", error: error.message });
    }
  };
  updateProductVariant = async (req: Request, res: Response) => {
    try {
      const variantId = Number(req.params.id);
      const variant = await this.productService.updateProductVariants(
        variantId,
        req.body
      );
      res.json(variant);
    } catch (error: any) {
      res.status(500).json({
        message: "Error updating product variant",
        error: error.message,
      });
    }
  };
  deleteProduct = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      await this.productService.deleteProduct(productId);
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error deleting product", error: error.message });
    }
  };

  deleteProductImages = async (req: Request, res: Response) => {
    try {
      const imageId = Number(req.params.id);
      const image = await this.productService.getProductImages(imageId);

      if (image?.image_url) {
        const filename = image.image_url.split("/").pop();
        if (filename) {
          this.uploadService.deleteFile(filename);
        }
      }
      await this.productService.deleteProductImages(imageId);
      res.json({ message: "Product image deleted successfully" });
    } catch (error: any) {
      res.status(500).json({
        message: "Error deleting product image",
        error: error.message,
      });
    }
  };

  deleteProductVariants = async (req: Request, res: Response) => {
    try {
      const variantId = Number(req.params.id);
      await this.productService.deleteProductVariants(variantId);
      res.json({ message: "Product variant deleted successfully" });
    } catch (error: any) {
      res.status(500).json({
        message: "Error deleting product variant",
        error: error.message,
      });
    }
  };

  filterProducts = async (req: Request, res: Response) => {
    try {
      const filters = await this.filterService.filterProducts(req.query);
      res.json(filters);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error filtering products", error: error.message });
    }
  };

  getFilterOptions = async (req: Request, res: Response) => {
    try {
      const options = await this.filterService.getFilterOptions();
      res.json(options);
    } catch (error: any) {
      res.status(500).json({
        message: "Error fetching filter options",
        error: error.message,
      });
    }
  };

  getProductVariants = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const variants = await this.variantService.getVariantsByProductId(
        productId
      );
      res.json(variants);
    } catch (error: any) {
      res.status(500).json({
        message: "Error fetching product variants",
        error: error.message,
      });
    }
  };
}

export default new ProductController();
