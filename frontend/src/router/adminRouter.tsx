import { Routes, Route } from "react-router-dom";
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
const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
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
      </Route>
    </Routes>
  );
};

export default AdminRouter;
