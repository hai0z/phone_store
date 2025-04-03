import { Request, Response } from "express";
import { VoucherService } from "../services/voucher.service";

class VoucherController {
  private voucherService: VoucherService;

  constructor() {
    this.voucherService = new VoucherService();
  }

  createVoucher = async (req: Request, res: Response) => {
    try {
      const voucherData = req.body;
      const voucher = await this.voucherService.createVoucher(voucherData);
      res.status(201).json(voucher);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get all vouchers
  getAllVouchers = async (_req: Request, res: Response) => {
    try {
      const vouchers = await this.voucherService.getAllVouchers();
      res.json(vouchers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get voucher by ID
  getVoucherById = async (req: Request, res: Response) => {
    try {
      const voucherId = parseInt(req.params.id);
      const voucher = await this.voucherService.getVoucherById(voucherId);
      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }
      res.json(voucher);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get voucher by code
  getVoucherByCode = async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const voucher = await this.voucherService.getVoucherByCode(code);
      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }
      res.json(voucher);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Update voucher
  updateVoucher = async (req: Request, res: Response) => {
    try {
      const voucherId = parseInt(req.params.id);
      const voucherData = req.body;
      const voucher = await this.voucherService.updateVoucher(
        voucherId,
        voucherData
      );
      res.json(voucher);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Delete voucher
  deleteVoucher = async (req: Request, res: Response) => {
    try {
      const voucherId = parseInt(req.params.id);
      await this.voucherService.deleteVoucher(voucherId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Validate voucher
  validateVoucher = async (req: Request, res: Response) => {
    try {
      const { code, orderAmount } = req.body;
      const result = await this.voucherService.validateVoucher(
        code,
        orderAmount
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}

const voucherController = new VoucherController();

export default voucherController;
