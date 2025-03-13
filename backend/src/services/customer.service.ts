import { BaseService } from "./base.service";
import { Customers, CustomersAddress } from "@prisma/client";

export class CustomerService extends BaseService {
  async getAllCustomers() {
    return this.prisma.customers.findMany();
  }

  async getCustomerById(customerId: number) {
    return this.prisma.customers.findUnique({
      where: { customer_id: customerId },
      include: {
        orders: {
          include: {
            orderDetails: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
        ratings: true,
        addresses: true,
      },
    });
  }

  async createCustomer(data: Omit<Customers, "customer_id">) {
    return this.prisma.customers.create({
      data,
    });
  }
  async createAddress(
    customerId: number,
    data: Omit<CustomersAddress, "address_id">
  ) {
    return this.prisma.customersAddress.create({
      data: {
        customer_id: customerId,
        address: data.address,
        is_default: data.is_default || false,
      },
    });
  }

  async updateCustomer(customerId: number, data: Partial<Customers>) {
    return this.prisma.customers.update({
      where: { customer_id: customerId },
      data,
    });
  }
  async updateAddress(addressId: number, data: Partial<CustomersAddress>) {
    return this.prisma.customersAddress.update({
      where: { address_id: addressId },
      data,
    });
  }

  async deleteCustomer(customerId: number) {
    return this.prisma.customers.delete({
      where: { customer_id: customerId },
    });
  }
  async deleteAddress(addressId: number) {
    return this.prisma.customersAddress.delete({
      where: { address_id: addressId },
    });
  }
}
