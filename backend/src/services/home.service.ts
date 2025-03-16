import { BaseService } from "./base.service";

export class HomeService extends BaseService {
  async getCustomerHomeData() {
    const [newArrivals, bestSellers, featuredProducts] = await Promise.all([
      // Get new arrivals (latest 8 products)
      this.prisma.products.findMany({
        take: 8,
        orderBy: { release_date: "desc" },
        select: {
          product_id: true,
          product_name: true,
          release_date: true,
          sold_count: true,
          brand_id: true,
          variants: {
            include: {
              color: true,
              storage: true,
              ram: true,
            },
          },
          images: true,
          ratings: true,
        },
      }),

      // Get best sellers (top 8 by sold_count)
      this.prisma.products.findMany({
        take: 8,
        orderBy: { sold_count: "desc" },
        select: {
          product_id: true,
          product_name: true,
          release_date: true,
          sold_count: true,
          brand_id: true,
          variants: {
            include: {
              color: true,
              storage: true,
              ram: true,
            },
          },
          images: true,
          ratings: true,
        },
      }),

      // Get featured products (products with promotional prices)
      this.prisma.products.findMany({
        take: 8,
        where: {
          variants: {
            some: {
              promotional_price: { not: null },
              promotion_end: { gt: new Date() },
            },
          },
        },
        select: {
          product_id: true,
          product_name: true,
          release_date: true,
          sold_count: true,
          brand_id: true,
          variants: {
            include: {
              color: true,
              storage: true,
              ram: true,
            },
          },
          images: true,
          ratings: true,
        },
      }),
    ]);

    return {
      newArrivals,
      bestSellers,
      featuredProducts,
    };
  }

  async getAdminHomeData() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

    const [
      totalProducts,
      totalCustomers,
      recentOrders,
      lowStockProducts,
      monthlyRevenue,
    ] = await Promise.all([
      // Get total products count
      this.prisma.products.count(),

      // Get total customers count
      this.prisma.customers.count(),

      // Get recent orders
      this.prisma.orders.findMany({
        take: 10,
        orderBy: { order_date: "desc" },
        include: {
          customer: {
            select: {
              full_name: true,
            },
          },
          orderDetails: {
            include: {
              variant: {
                include: {
                  product: {
                    select: {
                      product_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),

      // Get low stock products (less than 10 items)
      this.prisma.productVariants.findMany({
        where: {
          stock: { lt: 200 },
        },
        include: {
          product: {
            select: {
              product_name: true,
            },
          },
          color: true,
          storage: true,
        },
      }),

      // Get monthly revenue
      this.prisma.orders.aggregate({
        where: {
          order_date: {
            gte: thirtyDaysAgo,
          },
          status: "da_giao_hang",
        },
        _sum: {
          total_amount: true,
        },
      }),
    ]);

    return {
      statistics: {
        totalProducts,
        totalCustomers,
        monthlyRevenue: monthlyRevenue._sum.total_amount || 0,
      },
      recentOrders,
      lowStockProducts,
      phoneDistribution: await this.getPhoneDistributionByBrand(),
    };
  }

  async getPhoneDistributionByBrand() {
    const brands = await this.prisma.brands.findMany({
      select: {
        brand_id: true,
        brand_name: true,
        products: {
          select: {
            product_id: true,
          },
        },
      },
    });

    const brandCounts = brands.map((brand) => ({
      brand_name: brand.brand_name,
      count: brand.products.length,
    }));

    const labels = brands.map((brand) => brand.brand_name);
    const series = brands.map((brand) => brand.products.length);

    // Sum up other brands
    const otherBrandsCount = brandCounts
      .filter((brand) => !labels.includes(brand.brand_name))
      .reduce((sum, brand) => sum + brand.count, 0);

    if (otherBrandsCount > 0) {
      labels.push("Khác");
      series.push(otherBrandsCount);
    }

    return {
      labels,
      series,
    };
  }
}
