import express from "express";
import emailController from "../controllers/email.controller";

const router = express.Router();

router.post("/send-order-confirmation", emailController.sendOrderConfirmation);

export default router;
