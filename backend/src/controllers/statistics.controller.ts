import { Request, Response } from "express";
import { StatisticsService } from "../services/statistics.service";

class StatisticsController {
  private statisticsService: StatisticsService;

  constructor() {
    this.statisticsService = new StatisticsService();
  }

  getDailyRevenue = async (req: Request, res: Response) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const statistics = await this.statisticsService.getDailyRevenue(date);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Error getting daily revenue", error });
    }
  };

  getWeeklyRevenue = async (req: Request, res: Response) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const statistics = await this.statisticsService.getWeeklyRevenue(date);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Error getting weekly revenue", error });
    }
  };

  getMultiWeekRevenue = async (req: Request, res: Response) => {
    try {
      const weeks = parseInt(req.params.weeks) || 4; // Mặc định 4 tuần
      const statistics = await this.statisticsService.getMultiWeekRevenue(weeks);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Error getting multi-week revenue", error });
    }
  };

  getMonthlyRevenue = async (req: Request, res: Response) => {
    try {
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
      const statistics = await this.statisticsService.getMonthlyRevenue(year, month);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Error getting monthly revenue", error });
    }
  };

  getYearlyRevenue = async (req: Request, res: Response) => {
    try {
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const statistics = await this.statisticsService.getYearlyRevenue(year);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Error getting yearly revenue", error });
    }
  };

  getCustomDateRangeRevenue = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          message: "Both startDate and endDate are required" 
        });
      }

      const statistics = await this.statisticsService.getCustomDateRangeRevenue(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ 
        message: "Error getting custom date range revenue", 
        error 
      });
    }
  };
}

export default new StatisticsController();