import { BaseService } from "./base.service";
import * as nodemailer from "nodemailer";

export class EmailService extends BaseService {
  private transporter: any;
  constructor() {
    super();
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: "hainguyen56211@gmail.com",
        pass: "zpkirbyvkklrkqsr",
      },
    });
  }

  async sendOrderConfirmation({
    to,
    orderNumber,
    html,
  }: {
    to: string;
    orderNumber: string;
    html: string;
  }) {
    const subject = `Xác nhận đơn hàng #${orderNumber}`;
    return this.sendEmail(to, subject, html);
  }

  async sendPasswordReset(to: string, resetToken: string) {
    const subject = "Yêu cầu đặt lại mật khẩu";
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 25px;
            background-color: #f9f9f9;
          }
          h1 {
            color: #1890ff;
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #1890ff;
            padding-bottom: 10px;
          }
          .btn {
            display: inline-block;
            background-color: #1890ff;
            color: white;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 4px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
          }
          .footer {
            font-size: 12px;
            color: #777;
            margin-top: 30px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Đặt Lại Mật Khẩu</h1>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấp vào nút bên dưới để tiếp tục:</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="btn">Đặt Lại Mật Khẩu</a>
          </div>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
          <p><strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 1 giờ.</p>
          <div class="footer">
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(to, subject, html);
  }

  async sendWelcomeEmail(to: string, customerName: string) {
    const subject = "Chào mừng đến với Mobile Zone!";
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 25px;
            background-color: #f9f9f9;
          }
          h1 {
            color: #1890ff;
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #1890ff;
            padding-bottom: 10px;
          }
          .content {
            padding: 15px;
          }
          .footer {
            font-size: 12px;
            color: #777;
            margin-top: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
            padding-top: 15px;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Chào mừng đến với Mobile Zone!</h1>
          <div class="content">
            <p>Xin chào <strong>${customerName}</strong>,</p>
            <p>Cảm ơn bạn đã tạo tài khoản với chúng tôi.</p>
            <p>Chúng tôi rất vui mừng khi có bạn là thành viên của cộng đồng Mobile Zone.</p>
            <p>Hãy bắt đầu khám phá bộ sưu tập điện thoại di động và phụ kiện đa dạng của chúng tôi!</p>
          </div>
          <div class="footer">
            <p>© 2024 Mobile Zone. Tất cả các quyền được bảo lưu.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(to, subject, html);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || "Mobile Zone <noreply@mobilezone.com>",
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
  createOrderEmailTemplate = (order: any) => {
    const {
      order_id,
      customer,
      order_date,
      paymentMethod,
      address,
      orderDetails,
      total_amount,
    } = order;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đơn hàng</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-bottom: 3px solid #007bff;
            }
            .content {
                padding: 20px;
            }
            .order-info {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .product-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            .product-table th, .product-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            .product-table th {
                background-color: #f8f9fa;
            }
            .footer {
                text-align: center;
                padding: 20px;
                background-color: #f8f9fa;
                color: #666;
                font-size: 12px;
            }
            .total {
                font-size: 18px;
                font-weight: bold;
                text-align: right;
                padding: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Xác nhận đơn hàng #${order_id}</h1>
            </div>
            
            <div class="content">
                <p>Kính gửi ${customer.full_name},</p>
                <p>Cảm ơn bạn đã đặt hàng tại cửa hàng chúng tôi. Dưới đây là thông tin chi tiết đơn hàng của bạn:</p>

                <div class="order-info">
                    <h3>Thông tin đơn hàng:</h3>
                    <p><strong>Mã đơn hàng:</strong> #${order_id}</p>
                    <p><strong>Ngày đặt:</strong> ${new Date(
                      order_date
                    ).toLocaleString("vi-VN")}</p>
                    <p><strong>Phương thức thanh toán:</strong> ${
                      paymentMethod === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : "Thanh toán online qua VNPay"
                    }</p>
                    <p><strong>Trạng thái:</strong> Chờ xác nhận</p>
                </div>

                <div class="order-info">
                    <h3>Thông tin người nhận:</h3>
                    <p><strong>Họ tên:</strong> ${customer.full_name}</p>
                    <p><strong>Số điện thoại:</strong> ${customer.phone}</p>
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Địa chỉ:</strong> ${address}</p>
                </div>

                <h3>Chi tiết đơn hàng:</h3>
                <table class="product-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Cấu hình</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderDetails
                          .map(
                            (item: any) => `
                            <tr>
                                <td>${item.variant.product.product_name}</td>
                                <td>${item.variant.ram.capacity} - ${
                              item.variant.storage.storage_capacity
                            } - ${item.variant.color.color_name}</td>
                                <td>${item.quantity}</td>
                                <td>${new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(item.price)}</td>
                                <td>${new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(item.price * item.quantity)}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>

                <div class="total">
                    <p>Tổng tiền: ${new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(total_amount)}</p>
                </div>

                <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>
                <p>Trân trọng,<br>Shop điện thoại</p>
            </div>

            <div class="footer">
                <p>Email này được gửi tự động, vui lòng không trả lời email này.</p>
                <p>© 2024 Mobile Zone. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
  };
}
