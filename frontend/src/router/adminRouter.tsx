import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../pages/admin/Layout";
import Dashboard from "../pages/admin/DashBoard";
import AddProduct from "../pages/admin/product/add/AddProduct";
import ProductList from "../pages/admin/product/Index";
import BrandList from "../pages/admin/brand/Index";
import AddBrand from "../pages/admin/brand/AddBrand";
import EditBrand from "../pages/admin/brand/EditBrand";
import AddProductImageAndColor from "../pages/admin/product/add/AddProductImageAndColor";
import AddProductVariants from "../pages/admin/product/add/AddProductVariants";
import ProductEdit from "../pages/admin/product/edit";
import CategoryList from "../pages/admin/category/Index";
import AddCategory from "../pages/admin/category/AddCategory";
import EditCategory from "../pages/admin/category/EditCategory";
import OrderList from "../pages/admin/order/Index";
import OrderDetail from "../pages/admin/order/Detail";
import OrderEdit from "../pages/admin/order/Edit";
import RevenueAnalytics from "../pages/admin/stats/RevenueAnalytics";
import CustomerList from "../pages/admin/customer/CustomerList";
import CustomerDetail from "../pages/admin/customer/CustomerDetail";
import VoucherList from "../pages/admin/voucher/VoucherList";
import AddVoucher from "../pages/admin/voucher/AddVoucher";
import EditVoucher from "../pages/admin/voucher/EditVoucher";
import BannerList from "../pages/admin/banner/Index";
import AddBanner from "../pages/admin/banner/AddBanner";
import EditBanner from "../pages/admin/banner/EditBanner";
import AdminLogin from "../pages/admin/login/Login";
import { useAuth } from "../contexts/AuthContext";

const AdminRouter = () => {
  const { admin } = useAuth();

  // Check if user is logged in as admin
  const isAdmin = admin?.role === "admin";

  return (
    <Routes>
      {/* Public route for admin login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={isAdmin ? <AdminLayout /> : <Navigate to="/admin/login" />}
      >
        <Route index element={<Dashboard />} />
        <Route>
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route
            path="/admin/products/add/product-color-image/:id"
            element={<AddProductImageAndColor />}
          />
          <Route
            path="/admin/products/add/product-variants/:id"
            element={<AddProductVariants />}
          />
          <Route path="/admin/products/edit/:id" element={<ProductEdit />} />
        </Route>
        <Route>
          <Route path="/admin/brands" element={<BrandList />} />
          <Route path="/admin/brands/add" element={<AddBrand />} />
          <Route path="/admin/brands/edit/:id" element={<EditBrand />} />
        </Route>
        <Route>
          <Route path="/admin/categories" element={<CategoryList />} />
          <Route path="/admin/categories/add" element={<AddCategory />} />
          <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
        </Route>
        <Route>
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
          <Route path="/admin/orders/edit/:id" element={<OrderEdit />} />
        </Route>
        <Route>
          <Route path="/admin/revenue" element={<RevenueAnalytics />} />
        </Route>
        <Route>
          <Route path="/admin/customers" element={<CustomerList />} />
          <Route path="/admin/customers/:id" element={<CustomerDetail />} />
        </Route>
        <Route>
          <Route path="/admin/vouchers" element={<VoucherList />} />
          <Route path="/admin/vouchers/add" element={<AddVoucher />} />
          <Route path="/admin/vouchers/edit/:id" element={<EditVoucher />} />
        </Route>
        <Route>
          <Route path="/admin/banners" element={<BannerList />} />
          <Route path="/admin/banners/add" element={<AddBanner />} />
          <Route path="/admin/banners/edit/:id" element={<EditBanner />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRouter;
