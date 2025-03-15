import { Request, Response } from "express";
import { EmailService } from "../services/email.service";
import { OrderService } from "../services/order.service";

class EmailController {
  private emailService: EmailService;
  private orderService: OrderService;

  constructor() {
    this.emailService = new EmailService();
    this.orderService = new OrderService();
  }

  sendOrderConfirmation = async (req: Request, res: Response) => {
    try {
      const { to, orderNumber } = req.body;
      console.log(req.body);
      const orderDetails = await this.orderService.getOrderById(
        Number(orderNumber)
      );
      await this.emailService.sendOrderConfirmation({
        to,
        orderNumber,
        html: this.emailService.createOrderEmailTemplate(orderDetails),
      });
      res
        .status(200)
        .json({ message: "Order confirmation email sent successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}

const emailController = new EmailController();
export default emailController;
