import { BaseService } from "./base.service";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

interface LoginResponse {
  user: any;
  token: string;
  role: string;
}

export class AuthService extends BaseService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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

  async customerLogin(email: string, password: string): Promise<LoginResponse> {
    const customer = await this.prisma.customers.findUnique({
      where: { email },
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

  private generateToken(id: number, role: string): string {
    return jwt.sign({ id, role }, this.JWT_SECRET, { expiresIn: "7d" });
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
}
