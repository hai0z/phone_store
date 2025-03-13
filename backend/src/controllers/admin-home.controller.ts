import { Request, Response } from "express";
import { HomeService } from "../services/home.service";

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
}

export default new AdminHomeController();
