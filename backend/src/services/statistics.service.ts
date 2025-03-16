import { Orders, Products } from "@prisma/client";
import { BaseService } from "./base.service";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface RevenueStatistics {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  averageOrderValue: number;
  averageProfit: number;
  totalProducts: number;
  topSellingProducts: {
    product_id: number;
    product_name: string;
    quantity_sold: number;
    revenue: number;
    profit: number;
  }[];
  revenueByDay: { date: string; revenue: number; profit: number }[];
  revenueByMonth: { month: string; revenue: number; profit: number }[];
  revenueByWeek: { week: string; revenue: number; profit: number }[];
}

export class StatisticsService extends BaseService {
  async getRevenueStatistics(dateRange: DateRange): Promise<RevenueStatistics> {
    const { startDate, endDate } = dateRange;

    const orders = await this.prisma.orders.findMany({
      where: {
        order_date: {
          gte: startDate,
          lte: endDate,
        },
        status: "da_giao_hang",
      },
      include: {
        orderDetails: {
          include: {
            variant: true,
          },
        },
      },
    });

    const topProducts = await this.prisma.products.findMany({
      where: {
        variants: {
          some: {
            orderDetails: {
              some: {
                order: {
                  order_date: {
                    gte: startDate,
                    lte: endDate,
                  },
                  status: "da_giao_hang",
                },
              },
            },
          },
        },
      },
      include: {
        variants: {
          include: {
            orderDetails: {
              where: {
                order: {
                  order_date: {
                    gte: startDate,
                    lte: endDate,
                  },
                  status: "da_giao_hang",
                },
              },
            },
          },
        },
      },
      take: 5,
    });

    let totalRevenue = 0;
    let totalProfit = 0;

    orders.forEach((order) => {
      totalRevenue += Number(order.total_amount);
      order.orderDetails.forEach((detail) => {
        const profit =
          (Number(detail.price) - Number(detail.variant.original_price)) *
          detail.quantity;
        totalProfit += profit;
      });
    });

    const totalProducts = orders.reduce(
      (sum, order) =>
        sum +
        order.orderDetails.reduce(
          (detailSum, detail) => detailSum + detail.quantity,
          0
        ),
      0
    );

    const formattedTopProducts = topProducts.map((product) => {
      let totalQuantity = 0;
      let productRevenue = 0;
      let productProfit = 0;

      product.variants.forEach((variant) => {
        variant.orderDetails.forEach((detail) => {
          totalQuantity += detail.quantity;
          const revenue = detail.quantity * Number(detail.price);
          const profit =
            (Number(detail.price) - Number(variant.original_price)) *
            detail.quantity;
          productRevenue += revenue;
          productProfit += profit;
        });
      });

      return {
        product_id: product.product_id,
        product_name: product.product_name,
        quantity_sold: totalQuantity,
        revenue: productRevenue,
        profit: productProfit,
      };
    });

    const revenueByDay = this.calculateRevenueAndProfitByDay(orders);
    const revenueByMonth = this.calculateRevenueAndProfitByMonth(orders);
    const revenueByWeek = this.calculateRevenueAndProfitByWeek(orders);

    return {
      totalRevenue,
      totalProfit,
      totalOrders: orders.length,
      averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
      averageProfit: orders.length ? totalProfit / orders.length : 0,
      totalProducts,
      topSellingProducts: formattedTopProducts,
      revenueByDay,
      revenueByMonth,
      revenueByWeek,
    };
  }

  private calculateRevenueAndProfitByDay(
    orders: any[]
  ): { date: string; revenue: number; profit: number }[] {
    const revenueMap = new Map<string, { revenue: number; profit: number }>();

    orders.forEach((order) => {
      const date = new Date(order.order_date).toISOString().split("T")[0];
      const current = revenueMap.get(date) || { revenue: 0, profit: 0 };

      let dayProfit = 0;
      order.orderDetails.forEach((detail: any) => {
        dayProfit +=
          (Number(detail.price) - Number(detail.variant.original_price)) *
          detail.quantity;
      });

      revenueMap.set(date, {
        revenue: current.revenue + Number(order.total_amount),
        profit: current.profit + dayProfit,
      });
    });

    return Array.from(revenueMap.entries())
      .map(([date, { revenue, profit }]) => ({
        date,
        revenue,
        profit,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateRevenueAndProfitByMonth(
    orders: any[]
  ): { month: string; revenue: number; profit: number }[] {
    const revenueMap = new Map<string, { revenue: number; profit: number }>();

    orders.forEach((order) => {
      const date = new Date(order.order_date);
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const current = revenueMap.get(month) || { revenue: 0, profit: 0 };

      let monthProfit = 0;
      order.orderDetails.forEach((detail: any) => {
        monthProfit +=
          (Number(detail.price) - Number(detail.variant.original_price)) *
          detail.quantity;
      });

      revenueMap.set(month, {
        revenue: current.revenue + Number(order.total_amount),
        profit: current.profit + monthProfit,
      });
    });

    return Array.from(revenueMap.entries())
      .map(([month, { revenue, profit }]) => ({
        month,
        revenue,
        profit,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private calculateRevenueAndProfitByWeek(
    orders: any[]
  ): { week: string; revenue: number; profit: number }[] {
    const revenueMap = new Map<string, { revenue: number; profit: number }>();

    orders.forEach((order) => {
      const date = new Date(order.order_date);
      const startOfWeek = this.getStartOfWeek(date);
      const endOfWeek = this.getEndOfWeek(date);
      const weekKey = `${startOfWeek.toISOString().split("T")[0]} to ${
        endOfWeek.toISOString().split("T")[0]
      }`;

      const current = revenueMap.get(weekKey) || { revenue: 0, profit: 0 };

      let weekProfit = 0;
      order.orderDetails.forEach((detail: any) => {
        weekProfit +=
          (Number(detail.price) - Number(detail.variant.original_price)) *
          detail.quantity;
      });

      revenueMap.set(weekKey, {
        revenue: current.revenue + Number(order.total_amount),
        profit: current.profit + weekProfit,
      });
    });

    return Array.from(revenueMap.entries())
      .map(([week, { revenue, profit }]) => ({
        week,
        revenue,
        profit,
      }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const startOfWeek = new Date(d.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  private getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }

  async getDailyRevenue(date: Date): Promise<RevenueStatistics> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return this.getRevenueStatistics({ startDate, endDate });
  }

  async getMonthlyRevenue(
    year: number,
    month: number
  ): Promise<RevenueStatistics> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return this.getRevenueStatistics({ startDate, endDate });
  }

  async getYearlyRevenue(year: number): Promise<RevenueStatistics> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    return this.getRevenueStatistics({ startDate, endDate });
  }

  async getCustomDateRangeRevenue(
    startDate: Date,
    endDate: Date
  ): Promise<RevenueStatistics> {
    return this.getRevenueStatistics({ startDate, endDate });
  }

  async getWeeklyRevenue(date: Date): Promise<RevenueStatistics> {
    const startDate = this.getStartOfWeek(date);
    const endDate = this.getEndOfWeek(date);
    return this.getRevenueStatistics({ startDate, endDate });
  }

  async getMultiWeekRevenue(numberOfWeeks: number): Promise<RevenueStatistics> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numberOfWeeks * 7);

    return this.getRevenueStatistics({ startDate, endDate });
  }
}
