import { BaseService } from './base.service';
import { Vouchers } from '@prisma/client';

export class VoucherService extends BaseService {
  async validateVoucher(code: string, orderAmount: number) {
    const voucher = await this.prisma.vouchers.findUnique({
      where: { code },
    });

    if (!voucher) {
      throw new Error('Voucher not found');
    }

    const now = new Date();
    if (voucher.expiry_date && voucher.expiry_date < now) {
      throw new Error('Voucher has expired');
    }

    if (voucher.start_date && voucher.start_date > now) {
      throw new Error('Voucher is not yet active');
    }

    if (voucher.max_uses && voucher.used_count >= voucher.max_uses) {
      throw new Error('Voucher has reached maximum usage');
    }

    if (voucher.min_order_value && orderAmount < voucher.min_order_value) {
      throw new Error('Order amount does not meet minimum requirement');
    }

    return voucher;
  }

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

  async createVoucher(data: Omit<Vouchers, 'voucher_id' | 'used_count'>) {
    return this.prisma.vouchers.create({
      data: {
        ...data,
        used_count: 0,
      },
    });
  }
}