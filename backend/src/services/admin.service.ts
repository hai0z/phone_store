import { BaseService } from "./base.service";
import * as bcrypt from "bcrypt";
import { Admin } from "@prisma/client";

export class AdminService extends BaseService {
  async getAdminById(adminId: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { admin_id: adminId },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

    // Exclude password from the response
    const { password, ...adminData } = admin;
    return adminData;
  }

  async updateAdminProfile(
    adminId: number,
    data: { full_name: string; email: string }
  ) {
    const admin = await this.prisma.admin.findUnique({
      where: { admin_id: adminId },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

    // Check if email already exists for another admin
    if (data.email !== admin.email) {
      const existingAdmin = await this.prisma.admin.findFirst({
        where: {
          email: data.email,
          admin_id: { not: adminId },
        },
      });

      if (existingAdmin) {
        throw new Error("Email already in use");
      }
    }

    // Update admin profile
    const updatedAdmin = await this.prisma.admin.update({
      where: { admin_id: adminId },
      data: {
        full_name: data.full_name,
        email: data.email,
      },
    });

    // Exclude password from the response
    const { password, ...adminData } = updatedAdmin;
    return adminData;
  }

  async changeAdminPassword(
    adminId: number,
    currentPassword: string,
    newPassword: string
  ) {
    const admin = await this.prisma.admin.findUnique({
      where: { admin_id: adminId },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin password
    await this.prisma.admin.update({
      where: { admin_id: adminId },
      data: {
        password: hashedPassword,
      },
    });

    return { message: "Password updated successfully" };
  }
}

export default new AdminService();
