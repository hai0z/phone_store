import { Router } from "express";
import customerHomeController from "../controllers/customer-home.controller";
import customerController from "../controllers/customer.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = Router();

router.get("/home", customerHomeController.getHomeData);
router.get("/", customerController.getAllCustomers);
router.get(
  "/:id",
  authMiddleware(["customer"]),
  customerController.getCustomerById
);
router.post("/", customerController.createCustomer);

router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

// Customer address routes
router.post("/:id/addresses", customerController.createAddress);
router.put("/addresses/:addressId", customerController.updateAddress);
router.delete("/addresses/:addressId", customerController.deleteAddress);

export default router;
