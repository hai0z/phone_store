import { BaseService } from "./base.service";
import { Vouchers } from "@prisma/client";

export class VoucherService extends BaseService {
  // Get all vouchers
  async getAllVouchers() {
    return this.prisma.vouchers.findMany();
  }

  // Get voucher by ID
  async getVoucherById(voucherId: number) {
    return this.prisma.vouchers.findUnique({
      where: { voucher_id: voucherId },
    });
  }

  // Get voucher by code
  async getVoucherByCode(code: string) {
    return this.prisma.vouchers.findUnique({
      where: { code },
    });
  }

  // Create a new voucher
  async createVoucher(data: Omit<Vouchers, "voucher_id" | "used_count">) {
    // Validate voucher data
    if (!data.code) {
      throw new Error("Voucher code is required");
    }

    // Check if voucher code already exists
    const existingVoucher = await this.prisma.vouchers.findUnique({
      where: { code: data.code },
    });

    if (existingVoucher) {
      throw new Error("Voucher code already exists");
    }

    return this.prisma.vouchers.create({
      data: {
        ...data,
        used_count: 0,
      },
    });
  }

  // Update voucher
  async updateVoucher(
    voucherId: number,
    data: Partial<Omit<Vouchers, "voucher_id">>
  ) {
    // Check if voucher exists
    const existingVoucher = await this.prisma.vouchers.findUnique({
      where: { voucher_id: voucherId },
    });

    if (!existingVoucher) {
      throw new Error("Voucher not found");
    }

    // If code is being updated, check for uniqueness
    if (data.code && data.code !== existingVoucher.code) {
      const duplicateVoucher = await this.prisma.vouchers.findUnique({
        where: { code: data.code },
      });

      if (duplicateVoucher) {
        throw new Error("Voucher code already exists");
      }
    }

    return this.prisma.vouchers.update({
      where: { voucher_id: voucherId },
      data,
    });
  }

  // Delete voucher
  async deleteVoucher(voucherId: number) {
    // Check if voucher exists
    const existingVoucher = await this.prisma.vouchers.findUnique({
      where: { voucher_id: voucherId },
    });

    if (!existingVoucher) {
      throw new Error("Voucher not found");
    }

    return this.prisma.vouchers.delete({
      where: { voucher_id: voucherId },
    });
  }

  // Validate voucher
  async validateVoucher(code: string, orderAmount: number) {
    const voucher = await this.prisma.vouchers.findUnique({
      where: { code },
    });

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    const now = new Date();
    if (voucher.expiry_date && voucher.expiry_date < now) {
      throw new Error("Voucher has expired");
    }

    if (voucher.start_date && voucher.start_date > now) {
      throw new Error("Voucher is not yet active");
    }

    if (voucher.max_uses && voucher.used_count >= voucher.max_uses) {
      throw new Error("Voucher has reached maximum usage");
    }

    if (voucher.min_order_value && orderAmount < voucher.min_order_value) {
      throw new Error("Order amount does not meet minimum requirement");
    }

    // Calculate the discount amount
    let discountAmount;
    if (voucher.discount_type === "PERCENTAGE") {
      discountAmount = (orderAmount * voucher.discount_value) / 100;

      // Apply max_discount_value limit if it exists
      if (
        voucher.max_discount_value &&
        discountAmount > voucher.max_discount_value
      ) {
        discountAmount = voucher.max_discount_value;
      }
    } else {
      discountAmount = voucher.discount_value;
    }

    return {
      ...voucher,
      calculated_discount: discountAmount,
    };
  }

  // Use voucher
  async useVoucher(voucherId: number) {
    return this.prisma.vouchers.update({
      where: { voucher_id: voucherId },
      data: {
        used_count: {
          increment: 1,
        },
      },
    });
  }
}
