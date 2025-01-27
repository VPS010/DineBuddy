import React, { useState, useEffect, useRef } from "react";
import { Package, ChevronDown, Check, Flame } from "lucide-react";

const SpiceLevelIndicator = ({ level }) => {
  const spiceLevels = {
    Mild: {
      color: "text-green-500",
      flames: 1,
      bg: "bg-green-200",
      tooltip: "Spicelevel - Light spice",
      text: "text-green-800",
    },
    Medium: {
      color: "text-orange-500",
      flames: 1,
      text: "text-orange-800",
      bg: "bg-orange-100",
      tooltip: "Spicelevel - Moderate heat",
    },
    Spicy: {
      color: "text-red-500",
      flames: 1,
      bg: "bg-red-100",
      text: "text-red-800",
      tooltip: "Spicelevel- Spicy Hot!",
    },
  };

  const config = spiceLevels[level] || spiceLevels.Mild;

  return (
    <div className="group relative">
      <div
        className={`flex items-center gap-0.5 px-2 py-1 rounded-full ${config.bg}`}
      >
        <p className={`text-sm ${config.text}`}>{level}</p>
        {[...Array(config.flames)].map((_, index) => (
          <Flame
            key={index}
            className={`w-4 h-4 ${config.color} ${
              index > 0 ? "-ml-2" : ""
            } transition-transform duration-300 hover:scale-110`}
            style={{
              transform: `rotate(${index % 2 === 0 ? "-15deg" : "15deg"})`,
            }}
          />
        ))}
      </div>
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {config.tooltip}
      </div>
    </div>
  );
};

const StatusDropdown = ({ status, onSelect, onClose }) => {
  const dropdownRef = useRef(null);
  const statuses = ["Pending", "In Progress", "Completed"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-20"
    >
      {statuses.map((statusOption) => (
        <div
          key={statusOption}
          className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
          onClick={() => {
            onSelect(statusOption);
            onClose();
          }}
        >
          <span className="text-sm">{statusOption}</span>
          {status === statusOption && (
            <Check className="w-4 h-4 text-green-600" />
          )}
        </div>
      ))}
    </div>
  );
};

const OrderCard = ({ order, onItemStatusUpdate, isParcel }) => {
  const [expandedItemId, setExpandedItemId] = useState(null);

  const itemStatusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
  };

  // Sort items by status priority
  const sortedItems = [...order.items].sort((a, b) => {
    const statusPriority = {
      "Pending": 0,
      "In Progress": 1,
      "Completed": 2
    };
    return statusPriority[a.status] - statusPriority[b.status];
  });

  const updateAllItems = (newStatus) => {
    if (newStatus === "") return;

    order.items.forEach((item) => {
      const validTransitions = {
        Pending: ["In Progress", "Completed"],
        "In Progress": ["Completed"],
        Completed: [],
      };

      if (validTransitions[item.status].includes(newStatus)) {
        onItemStatusUpdate(order._id, item._id, newStatus);
      }
    });
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-4 w-full h-auto ${
        isParcel ? "border-amber-200 bg-amber-50" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {isParcel ? (
            <div className="flex items-center bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
              <Package className="w-4 h-4 mr-1" />
              <span>Parcel</span>
            </div>
          ) : (
            <span className="text-lg font-bold">Table {order.tableNumber}</span>
          )}
          <span className="text-gray-800 text-sm">
            ID:#{order._id.slice(0, 4)}
          </span>
        </div>
        <span className="text-sm text-gray-700">
          {new Date(order.createdAt).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-2">
        {sortedItems.map((item) => (
          <div key={item._id} className="relative">
            <div
              className={`${
                itemStatusColors[item.status]
              } rounded-lg p-2 cursor-pointer transition-all`}
              onClick={() =>
                setExpandedItemId(expandedItemId === item._id ? null : item._id)
              }
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{item.name}</span>
                <div className="flex items-center gap-3">
                  {item.spiceLevel && (
                    <SpiceLevelIndicator level={item.spiceLevel} />
                  )}
                  <span className="bg-white bg-opacity-50 px-2 py-1 rounded-full text-sm">
                    ×{item.quantity}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedItemId === item._id ? "transform rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            {expandedItemId === item._id && (
              <StatusDropdown
                status={item.status}
                onSelect={(newStatus) =>
                  onItemStatusUpdate(order._id, item._id, newStatus)
                }
                onClose={() => setExpandedItemId(null)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <select
          className="border rounded-lg px-4 py-2 text-sm bg-white w-full md:w-48"
          defaultValue=""
          onChange={(e) => {
            updateAllItems(e.target.value);
            e.target.value = "";
          }}
        >
          <option value="" disabled>
            Update All
          </option>
          <option value="In Progress">Start All</option>
          <option value="Completed">Complete All</option>
        </select>
      </div>
    </div>
  );
};

export default OrderCard;