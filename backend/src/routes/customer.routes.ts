import { Router } from "express";
import customerController from "../controllers/customer.controller";

const router = Router();

// Customer routes
router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);
router.post("/", customerController.createCustomer);

router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

// Customer address routes
router.post("/:customerId/addresses", customerController.createAddress);
router.put("/addresses/:addressId", customerController.updateAddress);
router.delete("/addresses/:addressId", customerController.deleteAddress);

export default router;
