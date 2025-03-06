import { Request, Response } from 'express';
import { ProductService, FilterService, ProductVariantService } from '../services';

export class ProductController {
  private productService: ProductService;
  private filterService: FilterService;
  private variantService: ProductVariantService;

  constructor() {
    this.productService = new ProductService();
    this.filterService = new FilterService();
    this.variantService = new ProductVariantService();
  }

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const product = await this.productService.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error: error.message });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const product = await this.productService.updateProduct(productId, req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error: error.message });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      await this.productService.deleteProduct(productId);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
  };

  filterProducts = async (req: Request, res: Response) => {
    try {
      const filters = await this.filterService.filterProducts(req.query);
      res.json(filters);
    } catch (error) {
      res.status(500).json({ message: 'Error filtering products', error: error.message });
    }
  };

  getFilterOptions = async (req: Request, res: Response) => {
    try {
      const options = await this.filterService.getFilterOptions();
      res.json(options);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching filter options', error: error.message });
    }
  };

  getProductVariants = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const variants = await this.variantService.getVariantsByProductId(productId);
      res.json(variants);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product variants', error: error.message });
    }
  };
}

export default new ProductController();