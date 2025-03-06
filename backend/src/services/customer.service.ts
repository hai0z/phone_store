import { BaseService } from './base.service';
import { Customers } from '@prisma/client';

export class CustomerService extends BaseService {
  async getAllCustomers() {
    return this.prisma.customers.findMany();
  }

  async getCustomerById(customerId: number) {
    return this.prisma.customers.findUnique({
      where: { customer_id: customerId },
      include: {
        orders: true,
        comments: true,
        ratings: true,
      },
    });
  }

  async createCustomer(data: Omit<Customers, 'customer_id'>) {
    return this.prisma.customers.create({
      data,
    });
  }

  async updateCustomer(customerId: number, data: Partial<Customers>) {
    return this.prisma.customers.update({
      where: { customer_id: customerId },
      data,
    });
  }

  async deleteCustomer(customerId: number) {
    return this.prisma.customers.delete({
      where: { customer_id: customerId },
    });
  }
}