import React from "react";
import { useSetRecoilState } from "recoil";
import { selectedItemState } from "./store/atoms";

const MenuItem = ({ item }) => {
  const setSelectedItem = useSetRecoilState(selectedItemState);

  return (
    <div className="group bg-white p-3 rounded-lg shadow-sm border border-[#E8E3D9] hover:shadow-md transition-all duration-300">
      <div className="flex gap-3">
        {/* Left Content */}
        <div className="flex-grow min-w-0">
          {/* Title Row */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`flex-shrink-0 w-4 h-4 border-2 ${
                item.isVeg ? "border-[#1c7d15]" : "border-[#8B3A3A]"
              } rounded-sm flex items-center justify-center`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? "bg-[#1c7d15]" : "bg-[#8B3A3A]"
                }`}
              />
            </span>
            <h3 className="text-[#2C3539] font-serif text-sm font-medium truncate">
              {item.name}
            </h3>
          </div>

          {/* Price and Tags Row */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#B8860B] font-serif text-sm font-semibold whitespace-nowrap">
              ₹{item.price.toFixed(2)}
            </span>
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {item.popularity.map((popularity) => (
                <span
                  key={popularity}
                  className="px-2 py-0.5 bg-[#F8F6F0] text-[#8B3A3A] text-xs whitespace-nowrap rounded-full"
                >
                  {popularity}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-[#666] text-xs leading-snug line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Right Content */}
        <div className="flex flex-col gap-1">
          <div className="relative">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg shadow-sm"
            />
            <div className="absolute inset-0 rounded-lg shadow-inner" />
          </div>
          <button
            onClick={() => setSelectedItem(item)}
            className="w-16 text-xs bg-[#2C3539] text-white py-1 rounded-full hover:bg-[#B8860B] transition-colors duration-300"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;