import express from "express";
import voucherController from "../controllers/voucher.controller";

const router = express.Router();

router.post("/", voucherController.createVoucher);
router.get("/", voucherController.getAllVouchers);
router.get("/code/:code", voucherController.getVoucherByCode);
router.get("/:id", voucherController.getVoucherById);
router.put("/:id", voucherController.updateVoucher);
router.delete("/:id", voucherController.deleteVoucher);

router.post("/validate", voucherController.validateVoucher);

export default router;
