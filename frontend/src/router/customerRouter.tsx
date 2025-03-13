import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../pages/customer/Layout";
import PhoneList from "../pages/customer/PhoneList";
import Cart from "../pages/customer/cart/Cart";
import CheckOut from "../pages/customer/checkout/Checkout";
import ProductDetail from "../pages/customer/product/ProductDetail";
import Home from "../pages/customer/Home";
import Login from "../pages/customer/login/Login";
import ProfilePage from "../pages/customer/profile/Index";
import CheckoutResult from "../pages/customer/checkout/CheckoutResult";
const CustomerRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route>
          <Route path="/dtdd" element={<PhoneList />} />
          <Route path="/dtdd/:id" element={<ProductDetail />} />
        </Route>
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<CheckOut />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="checkout/vnpay-return" element={<CheckoutResult />} />
      </Route>
    </Routes>
  );
};

export default CustomerRouter;
