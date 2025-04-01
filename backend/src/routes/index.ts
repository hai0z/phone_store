import { Router } from "express";
import authRoutes from "./auth.routes";
import brandRoutes from "./brand.routes";
import cartRoutes from "./cart.routes";
import customerRoutes from "./customer.routes";
import orderRoutes from "./order.routes";
import productRoutes from "./product.routes";
import ratingRoutes from "./rating.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/brands", brandRoutes);
router.use("/cart", cartRoutes);
router.use("/customers", customerRoutes);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);
router.use("/ratings", ratingRoutes);

export default router;
