import { BaseService } from "./base.service";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

interface LoginResponse {
  user: any;
  token: string;
  role: string;
}

export class AuthService extends BaseService {
  private readonly JWT_SECRET =
    process.env.JWT_SECRET || "mobile-zone-secret-key";

  async customerRegister(data: {
    full_name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<LoginResponse> {
    // Check if customer already exists
    const existingCustomer = await this.prisma.customers.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingCustomer) {
      throw new Error("Email hoặc số điện thoại đã được đăng ký");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create new customer
    const customer = await this.prisma.customers.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const { password: _, ...customerData } = customer;
    return {
      user: customerData,
      token: this.generateToken(customer.customer_id, "customer"),
      role: "customer",
    };
  }

  async adminLogin(username: string, password: string): Promise<LoginResponse> {
    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new Error("Invalid credentials");
    }

    const { password: _, ...adminData } = admin;
    return {
      user: adminData,
      token: this.generateToken(admin.admin_id, "admin"),
      role: "admin",
    };
  }

  async customerLogin(
    emailOrPhone: string,
    password: string
  ): Promise<LoginResponse> {
    const customer = await this.prisma.customers.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });

    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      throw new Error("Invalid credentials");
    }

    const { password: _, ...customerData } = customer;
    return {
      user: customerData,
      token: this.generateToken(customer.customer_id, "customer"),
      role: "customer",
    };
  }

  private generateToken(id: number, role: string, expiresIn?: any): string {
    return jwt.sign({ id, role }, this.JWT_SECRET, {
      expiresIn: expiresIn || "7d",
    });
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as {
        id: number;
        role: string;
      };

      if (decoded.role === "admin") {
        const admin = await this.prisma.admin.findUnique({
          where: { admin_id: decoded.id },
        });
        if (!admin) throw new Error("Admin not found");
        const { password, ...adminData } = admin;
        return { ...adminData, role: "admin" };
      } else {
        const customer = await this.prisma.customers.findUnique({
          where: { customer_id: decoded.id },
        });
        if (!customer) throw new Error("Customer not found");
        const { password, ...customerData } = customer;
        return { ...customerData, role: "customer" };
      }
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async forgotPassword(email: string) {
    const customer = await this.prisma.customers.findFirst({
      where: { email },
    });
    if (!customer) throw new Error("Địa chỉ email không tồn tại");
    const token = this.generateToken(customer.customer_id, "customer", "1h");
    return {
      message: "Đã gửi email khôi phục mật khẩu",
      token,
    };
  }

  async resetPassword(token: string, password: string) {
    const decoded = jwt.verify(token, this.JWT_SECRET) as {
      id: number;
      role: string;
    };
    const customer = await this.prisma.customers.findFirst({
      where: { customer_id: decoded.id },
    });
    if (!customer) throw new Error("Không tìm thấy khách hàng");
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.customers.update({
      where: { customer_id: decoded.id },
      data: { password: hashedPassword },
    });
    return {
      message: "Đã đặt lại mật khẩu",
    };
  }
}
