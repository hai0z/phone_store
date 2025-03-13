import { BaseService } from "./base.service";
import { Orders, OrderDetails } from "@prisma/client";
import {
  HashAlgorithm,
  VNPay,
  VnpLocale,
  dateFormat,
  ignoreLogger,
} from "vnpay";

export class OrderService extends BaseService {
  async createOrder(
    orderData: Omit<Orders, "order_id">,
    orderDetails: Omit<OrderDetails, "order_detail_id" | "order_id">[]
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
      for (const detail of orderDetails) {
        prisma.productVariants.update({
          where: { variant_id: detail.variant_id },
          data: {
            stock: {
              decrement: detail.quantity,
            },
          },
        });
      }

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

  async createPaymentVNPay(orderId: number, amount: number) {
    const vnpay = new VNPay({
      tmnCode: "J7PHPQD0",
      secureSecret: "TS9R8HHIC95IKFGQFTJKHT3L6NW9EODR",
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
      enableLog: true,
      loggerFn: ignoreLogger,
    });
    const oneHourLater = new Date();
    oneHourLater.setHours(oneHourLater.getHours() + 1);
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_OrderInfo: "Thanh toán đơn hàng",
      vnp_TxnRef: orderId.toString(),
      vnp_IpAddr: "127.0.0.1",
      vnp_ReturnUrl: `http://localhost:5173/checkout/vnpay-return`,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(oneHourLater),
      vnp_OrderType: "other",
    });
    return paymentUrl;
  }
}
