import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const MenuItemCard = ({ item, onEdit, onToggleStatus, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-lg font-medium">₹{item.price}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`w-4 h-4 sm:w-5 sm:h-5 border-2 ${
                  item.isVeg ? "border-[#1c7d15]" : "border-[#8B3A3A]"
                } rounded-sm flex items-center justify-center shadow-sm`}
              >
                <span
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                    item.isVeg ? "bg-[#1c7d15]" : "bg-[#8B3A3A]"
                  }`}
                />
              </span>
              <span className="px-2 mt-2 p-1 rounded-full text-xs bg-orange-100 text-orange-800">
                {item.spiceLevel}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {item.description}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {item.dietary?.map((diet, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {diet}
              </span>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {item.popularity?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              item.isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onToggleStatus(item._id)}
            className={`p-2 rounded-lg ${
              item.isAvailable
                ? "text-red-600 hover:bg-red-50"
                : "text-green-600 hover:bg-green-50"
            }`}
          >
            {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
