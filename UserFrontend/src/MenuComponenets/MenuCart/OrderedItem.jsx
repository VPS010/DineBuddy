import React from "react";

const OrderedItem = ({ item }) => (
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
                : `${
                    item.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`
            }`}
          >
            {item.status}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-100 rounded-lg px-2 py-0.5">
          <span className="text-center text-sm font-medium">
            {item.quantity}
          </span>
        </div>
        <span className="text-green-700 font-semibold text-sm md:text-base">
          ₹{(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

export default OrderedItem;
