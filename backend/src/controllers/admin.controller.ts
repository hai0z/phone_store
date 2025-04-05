import { Request, Response } from "express";
import { HomeService } from "../services/home.service";
import AdminService from "../services/admin.service";

export class AdminHomeController {
  private homeService: HomeService;

  constructor() {
    this.homeService = new HomeService();
  }

  getDashboardData = async (req: Request, res: Response) => {
    try {
      const dashboardData = await this.homeService.getAdminHomeData();
      res.json(dashboardData);
    } catch (error: any) {
      res.status(500).json({
        message: "Error fetching dashboard data",
        error: error.message,
      });
    }
  };

  // Get admin details by ID
  getAdminById = async (req: Request, res: Response) => {
    try {
      const adminId = Number(req.params.id);

      const admin = await AdminService.getAdminById(adminId);
      res.json(admin);
    } catch (error: any) {
      if (error.message === "Admin not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({
        message: "Error fetching admin details",
        error: error.message,
      });
    }
  };

  // Update admin profile
  updateAdminProfile = async (req: Request, res: Response) => {
    try {
      const adminId = Number(req.params.id);

      // Optional: Verify the requesting user is updating their own profile or is a super admin
      if (req.user.admin_id !== adminId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { full_name, email } = req.body;

      if (!full_name || !email) {
        return res
          .status(400)
          .json({ message: "Full name and email are required" });
      }

      const updatedAdmin = await AdminService.updateAdminProfile(adminId, {
        full_name,
        email,
      });

      res.json(updatedAdmin);
    } catch (error: any) {
      if (error.message === "Admin not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Email already in use") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({
        message: "Error updating admin profile",
        error: error.message,
      });
    }
  };

  // Change admin password
  changeAdminPassword = async (req: Request, res: Response) => {
    try {
      const adminId = Number(req.params.id);

      // Optional: Verify the requesting user is changing their own password or is a super admin
      if (req.user.admin_id !== adminId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { current_password, new_password } = req.body;

      if (!current_password || !new_password) {
        return res.status(400).json({
          message: "Current password and new password are required",
        });
      }

      // Validate new password
      if (new_password.length < 6) {
        return res.status(400).json({
          message: "New password must be at least 6 characters long",
        });
      }

      const result = await AdminService.changeAdminPassword(
        adminId,
        current_password,
        new_password
      );

      res.json(result);
    } catch (error: any) {
      if (error.message === "Admin not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Current password is incorrect") {
        return res.status(401).json({ message: error.message });
      }
      res.status(500).json({
        message: "Error changing admin password",
        error: error.message,
      });
    }
  };
}

export default new AdminHomeController();
