import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { ProductVariantService } from "../services/product-variant.service";
import { VoucherService } from "../services/voucher.service";
import { PrismaClient } from "@prisma/client";
class OrderController {
  private orderService: OrderService;
  private variantService: ProductVariantService;
  private voucherService: VoucherService;
  private prisma: PrismaClient;
  constructor() {
    this.orderService = new OrderService();
    this.variantService = new ProductVariantService();
    this.voucherService = new VoucherService();
    this.prisma = new PrismaClient();
  }

  getAllOrders = async (req: Request, res: Response) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
  createOrder = async (req: Request, res: Response) => {
    try {
      const { orderData, orderDetails, voucherId } = req.body;

      // Validate stock availability for all variants
      for (const detail of orderDetails) {
        const isAvailable = await this.variantService.checkAvailability(
          detail.variant_id,
          detail.quantity
        );
        if (!isAvailable) {
          return res.status(400).json({
            message: `Insufficient stock for variant ${detail.variant_id}`,
          });
        }
      }

      // If voucher is provided, validate it
      if (voucherId) {
        const totalAmount = orderDetails.reduce(
          (sum: number, detail: any) => sum + detail.price * detail.quantity,
          0
        );
        await this.voucherService.validateVoucher(voucherId, totalAmount);
        await this.voucherService.useVoucher(voucherId);
      }

      const result = await this.orderService.createOrder(
        orderData,
        orderDetails
      );
      for (const detail of orderDetails) {
        await this.variantService.updateStock(
          detail.variant_id,
          detail.quantity
        );
      }

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getOrderById = async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await this.orderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);

      const { status } = req.body;

      if (status === "da_huy") {
        const orderDetails = await this.prisma.orderDetails.findMany({
          where: { order_id: orderId },
        });
        for (const detail of orderDetails) {
          await this.variantService.updateStock(
            detail.variant_id,
            -detail.quantity
          );
        }
      }
      const order = await this.orderService.updateOrderStatus(orderId, status);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  createPaymentVNPay = async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const paymentUrl = await this.orderService.createPaymentVNPay(
        orderId,
        req.body.amount
      );
      res.json({ paymentUrl });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
const orderController = new OrderController();
export default orderController;
