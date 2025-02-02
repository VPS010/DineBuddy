import { useState, useEffect } from "react";

import {
  X,
  Menu,
  Search,
  Bell,
  ChevronDown,
  Home,
  User,
  Settings,
  Clock,
  Utensils,
  FileText,
  Star,
  AlertCircle,
  TrendingUp,
  LogOut,
  Layout,
  Construction,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [showOverlay, setShowOverlay] = useState(true);

  // Check localStorage on component mount
  useEffect(() => {
    const overlayPreference = localStorage.getItem("dashboardOverlayHidden");
    if (overlayPreference === "true") {
      setShowOverlay(false);
    }
  }, []);

  const handleToggleOverlay = () => {
    const newState = !showOverlay;
    setShowOverlay(newState);
    localStorage.setItem("dashboardOverlayHidden", (!newState).toString());
  };

  const salesData = [
    { day: "Mon", sales: 2400 },
    { day: "Tue", sales: 1398 },
    { day: "Wed", sales: 3800 },
    { day: "Thu", sales: 3908 },
    { day: "Fri", sales: 4800 },
    { day: "Sat", sales: 5800 },
    { day: "Sun", sales: 4000 },
  ];

  // Mock data for cards
  const orderStats = {
    totalOrders: 156,
    activeOrders: 23,
    completedOrders: 128,
    pendingOrders: 5,
  };

  const salesStats = {
    totalSales: 388459.99,
    avgOrderValue: 1504.23,
  };

  const feedback = {
    todayCount: 45,
    avgRating: 4.8,
    recentComment: "The food was amazing and the service was excellent!",
  };

  const topDishes = [
    { name: "Double Cheese Shawarma", orders: 42, rating: 4.9 },
    { name: "Butter Chicken", orders: 38, rating: 4.8 },
    { name: "Truffle Pasta", orders: 35, rating: 4.7 },
  ];

  const activeTables = {
    total: 8,
    tables: [1, 4, 7, 12, 15, 18, 22, 25],
  };

  const alerts = [
    { type: "warning", message: "Low stock: Truffle Oil" },
    { type: "info", message: "New menu item pending approval" },
    { type: "success", message: "Daily reports generated" },
  ];

  return (
    <>
      <div className="relative">
        {/* Show overlay banner even when main overlay is hidden */}
        {!showOverlay && (
          <div className="bg-yellow-100 border-b border-yellow-200 p-2 text-yellow-800 flex justify-between items-center">
            <span className="flex items-center">
              <Construction className="w-4 h-4 mr-2" />
              Dashboard is under development, This is Just a Static Design of our  Dashboard
            </span>
            <button
              onClick={handleToggleOverlay}
              className="text-sm bg-yellow-200 hover:bg-yellow-300 px-3 py-1 rounded-md transition-colors"
            >
              Show Details
            </button>
          </div>
        )}

        {/* Main overlay */}
        {showOverlay && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white/90 p-8 rounded-lg max-w-xl mx-4 shadow-xl text-center relative">
              <button
                onClick={handleToggleOverlay}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close overlay"
              >
                <X className="w-5 h-5" />
              </button>
              <Construction className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Dashboard Under Development
              </h2>
              <p className="text-gray-600 mb-4">
                We're currently enhancing this dashboard to provide you with
                better insights and functionality. All other sections of the
                application are fully operational and ready for use.
              </p>
              <div className="text-sm text-gray-500 mb-6">
                Expected completion: Soon
              </div>
              <button
                onClick={handleToggleOverlay}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Orders Overview Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Orders Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold">
                    {orderStats.totalOrders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active</span>
                  <span className="font-semibold text-emerald-600">
                    {orderStats.activeOrders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-blue-600">
                    {orderStats.completedOrders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-orange-600">
                    {orderStats.pendingOrders}
                  </span>
                </div>
              </div>
              <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700">
                View All Orders →
              </button>
            </div>

            {/* Sales Summary Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Sales Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sales</span>
                  <span className="font-semibold flex">
                    {salesStats.totalSales.toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Order Value</span>
                  <span className="font-semibold flex">
                    {salesStats.avgOrderValue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </span>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="#059669" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700">
                View Sales Report →
              </button>
            </div>

            {/* Customer Feedback Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Customer Feedback
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Today's Feedback</span>
                  <span className="font-semibold">{feedback.todayCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold flex items-center">
                    {feedback.avgRating}
                    <Star
                      size={16}
                      className="text-yellow-400 ml-1"
                      fill="currentColor"
                    />
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 italic">
                    "{feedback.recentComment}"
                  </p>
                </div>
              </div>
              <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700">
                View All Feedback →
              </button>
            </div>

            {/* Active Tables Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Active Tables
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Active</span>
                  <span className="font-semibold">{activeTables.total}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeTables.tables.map((table) => (
                    <span
                      key={table}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                    >
                      Table {table}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Performing Dishes */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Top Performing Dishes
              </h3>
              <div className="space-y-4">
                {topDishes.map((dish, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium text-gray-800">
                        {dish.name}
                      </span>
                      <div className="flex items-center mt-1">
                        <Star
                          size={16}
                          className="text-yellow-400"
                          fill="currentColor"
                        />
                        <span className="text-sm text-gray-600 ml-1">
                          {dish.rating}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {dish.orders} orders
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Notifications
              </h3>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg flex items-center
                      ${
                        alert.type === "warning"
                          ? "bg-yellow-50 text-yellow-700"
                          : alert.type === "info"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-green-50 text-green-700"
                      }`}
                  >
                    <AlertCircle size={20} className="mr-3" />
                    <span>{alert.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
