import { BaseService } from './base.service';
import { Orders, OrderDetails } from '@prisma/client';

export class OrderService extends BaseService {
  async createOrder(
    orderData: Omit<Orders, 'order_id'>,
    orderDetails: Omit<OrderDetails, 'order_detail_id' | 'order_id'>[]
  ) {
    return this.prisma.$transaction(async (prisma) => {
      // Create order
      const order = await prisma.orders.create({
        data: orderData,
      });

      // Create order details
      const details = await Promise.all(
        orderDetails.map((detail) =>
          prisma.orderDetails.create({
            data: {
              ...detail,
              order_id: order.order_id,
            },
          })
        )
      );

      // Update stock for each variant
      await Promise.all(
        orderDetails.map((detail) =>
          prisma.productVariants.update({
            where: { variant_id: detail.variant_id },
            data: {
              stock: {
                decrement: detail.quantity,
              },
            },
          })
        )
      );

      return { order, details };
    });
  }

  async getOrderById(orderId: number) {
    return this.prisma.orders.findUnique({
      where: { order_id: orderId },
      include: {
        customer: true,
        voucher: true,
        orderDetails: {
          include: {
            variant: {
              include: {
                product: true,
                color: true,
                storage: true,
              },
            },
          },
        },
      },
    });
  }

  async updateOrderStatus(orderId: number, status: string) {
    return this.prisma.orders.update({
      where: { order_id: orderId },
      data: { status },
    });
  }
}