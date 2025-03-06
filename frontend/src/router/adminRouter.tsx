import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/admin/Layout";
import Dashboard from "../pages/admin/DashBoard";
import ProductList from "../pages/admin/product";
import AddProduct from "../pages/admin/product/AddProduct";
import TechnicalSpecsDemo from "../pages/demo/TechnicalSpecsDemo";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route>
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/demo" element={<TechnicalSpecsDemo />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRouter;
