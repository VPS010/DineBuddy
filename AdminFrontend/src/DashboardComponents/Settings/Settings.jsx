import React, { useState } from "react";
import GeoFenceSelector from "./GeoFence";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabData = {
    general: {
      title: "General Settings",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Display Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your display name"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Email Notifications
            </label>
            <select className="w-full p-2 border rounded-md">
              <option>All notifications</option>
              <option>Important only</option>
              <option>None</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="darkMode" />
            <label htmlFor="darkMode">Enable Dark Mode</label>
          </div>
        </div>
      ),
    },
    Geofence: {
      title: "Geofence Settings",
      content:
      <>
      <p className="text-gray-600">Geofencing ensures your menu QR works only within your restaurant premises by defining a virtual boundary around your location.
      Simply draw and save your restaurant's boundary on the map to restrict access outside.</p>
      <GeoFenceSelector />
      </> ,
    },
    security: {
      title: "Security Settings",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Change Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Two-Factor Authentication
            </label>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="2fa" />
              <label htmlFor="2fa">Enable 2FA</label>
            </div>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md">
            Delete Account
          </button>
        </div>
      ),
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {Object.keys(tabData).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-600 hover:text-green-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          {tabData[activeTab].title}
        </h2>
        {tabData[activeTab].content}
      </div>
    </div>
  );
};

export default SettingsPage;
