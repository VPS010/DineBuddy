import React from "react";
import { X } from "lucide-react";

export const OrderedItem = ({ item, onDeleteAttempt, orderId }) => {
  const handleDelete = () => {
    const statusMessages = {
      Completed: {
        allowed: false,
        message: "This item has already been completed and cannot be deleted."
      },
      "In Progress": {
        allowed: false,
        message: "This item is currently being prepared and cannot be deleted."
      },
      Pending: {
        allowed: true,
        message: "Are you sure you want to delete this pending item?",
        item: item,
        orderId: orderId
      }
    };

    const status = statusMessages[item.status] || {
      allowed: false,
      message: "This item cannot be deleted at this time."
    };

    onDeleteAttempt(status);
  };

  return (
    <div className="flex items-center gap-3 p-4 my-2 border-b border-gray-200">
      <div className="flex-shrink-0">
        <img
          src={item.image || "/api/placeholder/56/56"}
          alt={item.name}
          className="w-14 h-14 object-cover rounded-md border border-gray-200"
        />
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h4 className="text-gray-800 font-medium text-sm md:text-base truncate">
            {item.name}
          </h4>
          <div className="flex flex-wrap gap-1">
            {item.spiceLevel && (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                {item.spiceLevel}
              </span>
            )}
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                item.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : item.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-2 py-0.5">
            <span className="text-center text-sm font-medium">{item.quantity}</span>
          </div>
          <span className="text-green-700 font-semibold text-sm md:text-base">
            ₹{(item.price * item.quantity).toFixed(2)}
          </span>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-full transition-colors text-[#9E2A2F] hover:bg-[#FDF2F3]"
            aria-label="Delete item"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Add both named and default export
export default OrderedItem;