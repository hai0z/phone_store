import {
  Routes,
  Route,
  ScrollRestoration,
  Router,
  Navigate,
} from "react-router-dom";
import CustomerLayout from "../pages/customer/Layout";
import PhoneList from "../pages/customer/PhoneList";
import Cart from "../pages/customer/cart/Cart";
import CheckOut from "../pages/customer/checkout/Checkout";
import ProductDetail from "../pages/customer/product/ProductDetail";
import Home from "../pages/customer/Home";
import Login from "../pages/customer/login/Login";
import ProfilePage from "../pages/customer/profile/Index";
import CheckoutResult from "../pages/customer/checkout/CheckoutResult";
import OrderDetail from "../pages/customer/order/OrderDetail";
import Register from "../pages/customer/login/Register";
import ForgotPassword from "../pages/customer/login/ForgotPassword";
import ResetPassword from "../pages/customer/login/ResetPassword";
import { useAuth } from "../contexts/AuthContext";
const CustomerRouter = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route>
          <Route path="/dtdd" element={<PhoneList />} />
          <Route path="/dtdd/:id" element={<ProductDetail />} />
        </Route>
        <Route path="cart" element={<Cart />} />
        <Route
          path="checkout"
          element={!user ? <Navigate to="/login" /> : <CheckOut />}
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="checkout/result" element={<CheckoutResult />} />
        <Route path="order/:order_id" element={<OrderDetail />} />
      </Route>
    </Routes>
  );
};

export default CustomerRouter;
