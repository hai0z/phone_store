import { BaseService } from "./base.service";
import { Customers, CustomersAddress } from "@prisma/client";

export class CustomerService extends BaseService {
  async getAllCustomers() {
    return this.prisma.customers.findMany({
      include: {
        addresses: true,
      },
    });
  }

  async getCustomerById(customerId: number) {
    return this.prisma.customers.findUnique({
      where: { customer_id: customerId },
      include: {
        orders: {
          orderBy: {
            order_date: "desc",
          },
          include: {
            orderDetails: {
              include: {
                variant: {
                  include: {
                    product: {
                      select: {
                        product_id: true,
                        product_name: true,
                        images: true,
                      },
                    },
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

  async getCustomerOrders(customerId: number) {
    return this.prisma.orders.findMany({
      where: { customer_id: customerId },
      include: {
        orderDetails: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    product_id: true,
                    product_name: true,
                    images: true,
                  },
                },
                ram: true,
                storage: true,
                color: true,
              },
            },
          },
        },
      },
    });
  }

  async getCustomerRatings(customerId: number) {
    return this.prisma.ratings.findMany({
      where: { customer_id: customerId },
      include: {
        product: {
          select: {
            product_id: true,
            product_name: true,
          },
        },
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
    const address = await this.prisma.customersAddress.findUnique({
      where: { address_id: addressId },
    });
    if (!address) {
      throw new Error("Address not found");
    }
    if (data.is_default) {
      await this.prisma.customersAddress.updateMany({
        where: { customer_id: address.customer_id },
        data: { is_default: false },
      });
    }
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
