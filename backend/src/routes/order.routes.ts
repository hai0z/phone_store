import { Router } from "express";
import orderController from "../controllers/order.controller";

const router = Router();

// Create a new order
router.post("/", orderController.createOrder);

// Get order by ID
router.get("/:id", orderController.getOrderById);

// Update order status
router.patch("/:id/status", orderController.updateOrderStatus);

// Create VNPay payment URL
router.post("/:id/payment/vnpay", orderController.createPaymentVNPay);

export default router;
