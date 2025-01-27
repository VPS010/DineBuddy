import React, { useState } from "react";
import GeoFenceSelector from "./GeoFence";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabData = {
    general: {
      title: "General Settings",
      content: (
        <div className="space-y-4">
          <p className="font-semibold text-2xl">UNDER DEVELOPMENT</p>
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
      <p className="font-semibold text-2xl">UNDER DEVELOPMENT</p>
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
