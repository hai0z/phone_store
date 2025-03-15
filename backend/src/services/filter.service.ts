import dayjs from "dayjs";
import { BaseService } from "./base.service";
import { Prisma } from "@prisma/client";
interface FilterOptions {
  brandIds?: number[];
  categoryIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  colors?: number[];
  ram?: number[];
  storages?: number[];
  search?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
}

export class FilterService extends BaseService {
  async filterProducts(options: FilterOptions) {
    const {
      brandIds,
      categoryIds,
      minPrice,
      maxPrice,
      colors,
      storages,
      search,
      inStock,
      ram,
      page = 1,
      limit = 16,
      sortBy = "price_asc",
    } = options;

    // Build where conditions
    const where: Prisma.ProductsWhereInput = {
      AND: [
        // Brand filter
        brandIds?.length ? { brand_id: { in: brandIds } } : {},
        // Category filter
        categoryIds?.length ? { category_id: { in: categoryIds } } : {},
        // Search by name
        search ? { product_name: { contains: search } } : {},
        // Stock availability
        inStock
          ? {
              variants: {
                some: {
                  stock: { gt: 0 },
                },
              },
            }
          : {},
        // Price range filter
        {
          variants: {
            some: {
              AND: [
                minPrice ? { original_price: { gte: minPrice } } : {},
                maxPrice ? { original_price: { lte: maxPrice } } : {},
                colors?.length ? { color_id: { in: colors } } : {},
                storages?.length ? { storage_id: { in: storages } } : {},
                ram?.length ? { ram_id: { in: ram } } : {},
              ],
            },
          },
        },
      ],
    };

    // Build orderBy condition for name sorting
    let orderBy: any = {};

    if (sortBy === "name_asc") {
      orderBy = { product_name: "asc" };
    } else if (sortBy === "name_desc") {
      orderBy = { product_name: "desc" };
    }

    // Get total count for pagination
    const total = await this.prisma.products.count({ where });

    // Get filtered products
    const products = await this.prisma.products.findMany({
      where,
      ...(sortBy === "name_asc" || sortBy === "name_desc" ? { orderBy } : {}),
      skip: (page - 1) * limit,
      take: limit,
      select: {
        product_id: true,
        product_name: true,
        brand: true,
        images: true,
        sold_count: true,
        category: true,
        variants: {
          include: {
            color: true,
            storage: true,
            ram: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate average rating for each product
    let productsWithRating = products.map((product) => ({
      ...product,
      averageRating: product.ratings.length
        ? product.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
          product.ratings.length
        : null,
      // Get minimum price from variants for sorting
      minPrice: Math.min(
        ...product.variants.map((v) =>
          v.promotional_price &&
          v.promotion_start &&
          v.promotion_end &&
          dayjs().isAfter(dayjs(v.promotion_start)) &&
          dayjs().isBefore(dayjs(v.promotion_end))
            ? v.promotional_price
            : v.sale_price
        )
      ),
    }));

    // Handle price sorting
    if (sortBy === "price_asc") {
      productsWithRating = productsWithRating.sort(
        (a, b) => a.minPrice - b.minPrice
      );
    } else if (sortBy === "price_desc") {
      productsWithRating = productsWithRating.sort(
        (a, b) => b.minPrice - a.minPrice
      );
    }

    return {
      products: productsWithRating,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFilterOptions() {
    const [brands, categories, colors, storages, ram] = await Promise.all([
      this.prisma.brands.findMany(),
      this.prisma.categories.findMany(),
      this.prisma.colors.findMany(),
      this.prisma.storages.findMany(),
      this.prisma.ram.findMany(),
    ]);

    const priceRange = await this.prisma.productVariants.aggregate({
      _min: {
        original_price: true,
        promotional_price: true,
      },
      _max: {
        sale_price: true,
      },
    });

    return {
      brands,
      categories,
      colors,
      storages,
      ram,
      priceRange: {
        min: priceRange._min.original_price,
        max: priceRange._max.sale_price,
      },
    };
  }
}
