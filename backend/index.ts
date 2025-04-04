import express from "express";
import cors from "cors";
import ProductRoute from "./src/routes/product.routes";
import UploadRoute from "./src/routes/upload.routes";
import BrandRoute from "./src/routes/brand.routes";
import CategoriesRoute from "./src/routes/categories.routes";
import ColorsRoute from "./src/routes/color.routes";
import StorageRoute from "./src/routes/storage.routes";
import RamRoute from "./src/routes/ram.routes";
import CustomerHomeRoute from "./src/routes/customer.router";
import AdminHomeRoute from "./src/routes/admin.routes";
import CartRoute from "./src/routes/cart.routes";
import AuthRoute from "./src/routes/auth.routes";
import OrderRoute from "./src/routes/order.routes";
import EmailRoute from "./src/routes/email.routes";
import VoucherRoute from "./src/routes/voucher.routes";
import path from "path";
import StatisticsRoute from "./src/routes/statistics.routes";
import RattingRoute from "./src/routes/rating.routes";
import BannerRoute from "./src/routes/banner.routes";

const app = express();
const port = 8080;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/products", ProductRoute);
app.use("/api/v1/brands", BrandRoute);
app.use("/api/v1/upload", UploadRoute);
app.use("/api/v1/categories", CategoriesRoute);
app.use("/api/v1/colors", ColorsRoute);
app.use("/api/v1/storages", StorageRoute);
app.use("/api/v1/rams", RamRoute);
app.use("/api/v1/customers", CustomerHomeRoute);
app.use("/api/v1/admin", AdminHomeRoute);
app.use("/api/v1/cart", CartRoute);
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/orders", OrderRoute);
app.use("/api/v1/email", EmailRoute);
app.use("/api/v1/statistics", StatisticsRoute);
app.use("/api/v1/ratings", RattingRoute);
app.use("/api/v1/vouchers", VoucherRoute);
app.use("/api/v1/banners", BannerRoute);
app.listen(port, () => {
  console.log(`backendd listening at http://localhost:${port}`);
});
