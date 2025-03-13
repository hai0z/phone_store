import { Request, Response } from "express";
import { HomeService } from "../services/home.service";

export class CustomerHomeController {
  private homeService: HomeService;

  constructor() {
    this.homeService = new HomeService();
  }

  getHomeData = async (req: Request, res: Response) => {
    try {
      const homeData = await this.homeService.getCustomerHomeData();
      res.json(homeData);
    } catch (error: any) {
      res.status(500).json({
        message: "Error fetching home data",
        error: error.message,
      });
    }
  };
}

export default new CustomerHomeController();
