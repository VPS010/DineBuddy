import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Components for General
import LandingPage from "./pages/LandingPage";

// Import Components for Customers
import UserMenuPage from "./pages/UserMenuPage";

// import MenuPage from './pages/MenuPage';
// import CartPage from './pages/CartPage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import OrderConfirmation from './pages/OrderConfirmation';
// import OrderStatus from './pages/OrderStatus';

// import AdminLogin from './admin/AdminLogin';
// import AdminDashboard from './admin/AdminDashboard';
// import MenuManagement from './admin/MenuManagement';
// import OrderManagement from './admin/OrderManagement';
// import KitchenView from './admin/KitchenView';
// import RestaurantProfile from './admin/RestaurantProfile';
// import Analytics from './admin/Analytics';
// import AdminSettings from './admin/AdminSettings';

const App = () => {
  return (
    <>
      <ToastContainer
        style={{ zIndex: 9999 }} // Set your desired z-index
      />
      <BrowserRouter>
        <Routes>
          {/* Common Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Customer Routes */}
          {/* <Route path="/user/menu/:restaurantId" element={<MenuPage />} /> */}
          <Route path="/user/menu/:restaurantId" element={<UserMenuPage />} />

          {/* <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/order-status" element={<OrderStatus />} /> */}

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
