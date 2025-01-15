import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Components for Customers
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/Adminlogin';
import AdminSignup from './pages/AdminSignup';
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import AdminProfile from './DashboardComponents/AdminProfile/AdminProfile2';
// import MenuPage from './pages/MenuPage';
// import CartPage from './pages/CartPage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import OrderConfirmation from './pages/OrderConfirmation';
// import OrderStatus from './pages/OrderStatus';

// Import Components for Admin
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
        <BrowserRouter>
            <Routes>

              {/* Common Route */}
                <Route path="/" element={<LandingPage />} />


    {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/signup" element={<AdminSignup/>} />
                <Route path="/admin/dashboard" element={<DashboardPage />} />
                <Route path="/admin/menu" element={<MenuPage/>} />
                <Route path="/admin/p" element={<AdminProfile/>} />
                

                {/* Customer Routes */}
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
    );
};

export default App;
