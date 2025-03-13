import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";

class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  getAllCustomers = async (req: Request, res: Response) => {
    try {
      const customers = await this.customerService.getAllCustomers();
      const customersWithoutPassword = customers.map((customer) => {
        const { password, ...customerWithoutPassword } = customer;
        return customerWithoutPassword;
      });
      res.json(customersWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching customers", error });
    }
  };

  getCustomerById = async (req: Request, res: Response) => {
    try {
      const customerId = parseInt(req.params.id);
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      const { password, ...customerWithoutPassword } = customer;
      res.json(customerWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching customer", error });
    }
  };

  createCustomer = async (req: Request, res: Response) => {
    try {
      const customer = await this.customerService.createCustomer(req.body);
      res.status(201).json(customer);
    } catch (error) {
      res.status(500).json({ message: "Error creating customer", error });
    }
  };

  createAddress = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const address = await this.customerService.createAddress(id, req.body);
      res.status(201).json(address);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating address" + error.message });
    }
  };

  updateCustomer = async (req: Request, res: Response) => {
    try {
      const customerId = parseInt(req.params.id);
      const customer = await this.customerService.updateCustomer(
        customerId,
        req.body
      );
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Error updating customer", error });
    }
  };

  updateAddress = async (req: Request, res: Response) => {
    try {
      const addressId = parseInt(req.params.addressId);
      const address = await this.customerService.updateAddress(
        addressId,
        req.body
      );
      res.json(address);
    } catch (error) {
      res.status(500).json({ message: "Error updating address", error });
    }
  };

  deleteCustomer = async (req: Request, res: Response) => {
    try {
      const customerId = parseInt(req.params.id);
      await this.customerService.deleteCustomer(customerId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting customer", error });
    }
  };

  deleteAddress = async (req: Request, res: Response) => {
    try {
      const addressId = parseInt(req.params.addressId);
      await this.customerService.deleteAddress(addressId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting address", error });
    }
  };
}
const customerController = new CustomerController();

export default customerController;
