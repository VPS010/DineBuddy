import React, { useState } from "react";
import {
  Menu,
  Bell,
  ChevronDown,
  Home,
  User,
  Settings,
  Clock,
  Utensils,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Dashboard from "../DashboardComponents/Dashboard";
import AdminProfile from "../DashboardComponents/AdminProfile/mainAdminProfile";
import MenuManagement from "../DashboardComponents/AdminMenu/MenuManagement";
import KitchenScreen from "../DashboardComponents/KitchenScreen";
import QRCodeGenerator from "../DashboardComponents/QRgenerator/QRCodeGenerator";
import SettingsPage from "../DashboardComponents/Settings/Settings";
import UnifiedAdminOrder from "../DashboardComponents/AdminOrders/UnifiedAdminOrder";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  const NavbarHandle = (id) => {
    setActiveSection(id);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-width duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1
            className={`font-bold text-4xl text-emerald-800 ${
              !isSidebarOpen && "hidden"
            }`}
          >
            DineBuddy
          </h1>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="mt-8">
          {[
            { icon: Home, label: "Dashboard", id: "dashboard" },
            { icon: Clock, label: "Orders", id: "orders" },
            { icon: Utensils, label: "Kitchen Screen", id: "kitchen" },
            { icon: FileText, label: "Menu", id: "menu" },
            { icon: User, label: "Profile", id: "profile" },
            { icon: Settings, label: "Settings", id: "settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                NavbarHandle(item.id);
              }}
              className={`w-full flex items-center p-4 hover:bg-emerald-50 transition-colors
                ${
                  activeSection === item.id
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-gray-600"
                }
                ${!isSidebarOpen && "justify-center"}`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="ml-4">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}

        <header className="bg-white  shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex justify-between">
              <div>
                <h1
                  className={`font-bold text-4xl text-emerald-800 ${
                    isSidebarOpen && "hidden"
                  }`}
                >
                  DineBuddy
                </h1>
              </div>
              <div className="bg-gray-600 h-full rounded-md mx-5 ml-9">
                <button
                  onClick={() => setActiveSection("generateQR")}
                  className="text-gray-100 font-medium px-5 p-2 bg-green-800 rounded-md hover:bg-green-700 group relative transition-all duration-300overflow-hidden focus:ring-1 focus: outline-none focus:ring-slate-600 text-sm text-center transform active:scale-95 transform-all ease-in-out "
                >
                  Get QR Codes
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-2">
                <img
                  src="/api/placeholder/32/32"
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
                <ChevronDown size={16} className="text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Conditional Rendering of Sections */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection === "orders" && <UnifiedAdminOrder />}
          {activeSection === "kitchen" && <KitchenScreen />}
          {activeSection === "menu" && <MenuManagement />}
          {activeSection === "profile" && <AdminProfile />}
          {activeSection === "generateQR" && <QRCodeGenerator />}
          {activeSection === "settings" && <SettingsPage />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
