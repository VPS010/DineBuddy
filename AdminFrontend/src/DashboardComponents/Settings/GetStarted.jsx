import React, { useState } from "react";
import { Phone } from "lucide-react";

const GettingStartedGuide = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const restaurantDetails = {
    name: "Royal Palace Dines",
    address: "delhi-6 jamnagar",
    contact: "1234567890",
    taxRate: "12.0%",
    hours: {
      Monday: "1:00 AM - 10:00 PM",
      Tuesday: "11:00 AM - 10:00 PM",
      Wednesday: "11:00 AM - 10:00 PM",
      Thursday: "11:00 AM - 10:00 PM",
      Friday: "11:00 AM - 10:00 PM",
      Saturday: "11:00 AM - 10:00 PM",
      Sunday: "11:00 AM - 12:00 PM",
    },
    memberSince: "1/15/2025",
  };

  const steps = [
    {
      title: "Complete Restaurant Profile",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Start by filling in your restaurant's essential information in the
            Profile tab:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Restaurant Details Example:</h4>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Restaurant Name:</span>{" "}
                {restaurantDetails.name}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {restaurantDetails.address}
              </p>
              <p>
                <span className="font-medium">Contact:</span>{" "}
                {restaurantDetails.contact}
              </p>
              <p>
                <span className="font-medium">Tax Rate:</span>{" "}
                {restaurantDetails.taxRate}
              </p>
              <div className="mt-4">
                <h5 className="font-medium mb-2">Business Hours:</h5>
                {Object.entries(restaurantDetails.hours).map(([day, hours]) => (
                  <p key={day}>
                    <span className="font-medium">{day}:</span> {hours}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Set Up Your Menu",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Navigate to the Menu section to organize your offerings:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Create menu categories (e.g., Starters, Main Course, Desserts)
            </li>
            <li>Add items to each category with prices and descriptions</li>
            <li>Upload high-quality images for your dishes</li>
            <li>
              Set item availability and special tags (Veg/Non-Veg, Spicy, etc.)
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Configure Geofence",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            In the Settings tab, define your service area:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the Geofence settings</li>
            <li>Search and find your place</li>
            <li>
              Select your restaurant's building area (recommended to select
              3-4 meters extra area)
            </li>
            <li>Fine-tune the boundaries as needed</li>
            <li>
              Save your settings to activate Your QRs to work in the selected
              area
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Generate and Set Up QR Codes",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Prepare your QR codes for customer use:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Click on the Get QR Codes button for each table</li>
            <li>Download and print QR codes in high quality</li>
            <li>Place QR codes strategically on each table</li>
            <li>Test scanning to ensure proper functionality</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Kitchen Setup and Order Management",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Set up your kitchen display system:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Install the kitchen display screen</li>
            <li>Configure order notifications</li>
            <li>Train staff on the order management system</li>
            <li>Set up printer connections if needed</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to <span className="text-green-800">DineBuddy</span>{" "}
        </h1>
        <p className="text-xl text-gray-600">
          Together, Let's Transform Your Restaurant Experience
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center"
              onClick={() =>
                setExpandedSection(expandedSection === index ? null : index)
              }
            >
              <h2 className="text-xl font-semibold">
                <span className="mr-4 text-green-600">#{index + 1}</span>
                {step.title}
              </h2>
              <span className="text-2xl">
                {expandedSection === index ? "−" : "+"}
              </span>
            </button>
            {expandedSection === index && (
              <div className="px-6 py-4 border-t">{step.content}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-green-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">You're All Set! 🎉</h3>
        <p className="text-gray-700">
          Your dashboard is now ready to create, accept, and manage orders,menu
          and kitchen operations. Explore the analytics dashboard to track your
          business performance(CURRENTLY UNDER DEVELOPMENT) and optimize your
          operations.
        </p>
      </div>
      <div className="flex justify-center mt-8 item-center">
        <p className="flex w-full justify-center items-center">
          If having any issue please don't hesitate to reach out our team  <Phone className="h-4 w-4 m-1" />
          +91 9103123156
        </p>
      </div>
    </div>
  );
};

export default GettingStartedGuide;
