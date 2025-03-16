import { Router } from "express";
import statisticsController from "../controllers/statistics.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Bảo vệ tất cả các routes thống kê chỉ cho admin truy cập
// router.use(authMiddleware(["admin"]));

// Lấy thống kê theo ngày
router.get("/daily", statisticsController.getDailyRevenue);

// Lấy thống kê theo tuần
router.get("/weekly", statisticsController.getWeeklyRevenue);
router.get("/weekly/:weeks", statisticsController.getMultiWeekRevenue);

// Lấy thống kê theo tháng
router.get("/monthly", statisticsController.getMonthlyRevenue);

// Lấy thống kê theo năm
router.get("/yearly", statisticsController.getYearlyRevenue);

// Lấy thống kê theo khoảng thời gian tùy chọn
router.get("/custom", statisticsController.getCustomDateRangeRevenue);

export default router;
