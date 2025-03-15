import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();
const orderController = new OrderController();

// Create a new order
router.post("/", orderController.createOrder.bind(orderController));

// Get order by ID
router.get("/:id", orderController.getOrderById.bind(orderController));

// Update order status
router.patch("/:id/status", orderController.updateOrderStatus.bind(orderController));

// Create VNPay payment URL
router.post("/:id/payment/vnpay", orderController.createPaymentVNPay.bind(orderController));

export default router;