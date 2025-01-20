import React, { useState, useRef, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { selectedItemState } from "./store/atoms";
import { X } from "lucide-react";

const MenuItem = ({ item }) => {
  const setSelectedItem = useSetRecoilState(selectedItemState);
  const [isExpanded, setIsExpanded] = useState(false);
  const modalRef = useRef(null);

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (item.isAvailable) {
      setIsExpanded(true);
      console.log("Image clicked, expanding...");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  return (
    <div className="relative">
      <div
        className={`group bg-white p-3 rounded-lg shadow-sm border
        ${
          item.isAvailable
            ? "border-[#E8E3D9] hover:shadow-md"
            : "border-gray-200 bg-gray-50"
        } transition-all duration-300 relative`}
      >
        {!item.isAvailable && (
          <span className="absolute -top-2 right-2 px-2 py-0.5 bg-gray-500 text-white text-xs rounded-full">
            Unavailable Today
          </span>
        )}
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
              <h3
                className={`text-[#2C3539] font-serif text-sm font-medium truncate
                ${!item.isAvailable && "text-gray-500"}`}
              >
                {item.name}
              </h3>
            </div>

            {/* Price and Tags Row */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`font-serif text-sm font-semibold whitespace-nowrap
                ${item.isAvailable ? "text-[#B8860B]" : "text-gray-500"}`}
              >
                ₹{item.price.toFixed(2)}
              </span>
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {item.popularity.map((popularity) => (
                  <span
                    key={popularity}
                    className={`px-2 py-0.5 text-xs whitespace-nowrap rounded-full
                      ${
                        item.isAvailable
                          ? "bg-[#F8F6F0] text-[#8B3A3A]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {popularity}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p
              className={`text-xs leading-snug line-clamp-2
              ${item.isAvailable ? "text-[#666]" : "text-gray-500"}`}
            >
              {item.description}
            </p>
          </div>

          {/* Right Content */}
          <div className="flex flex-col gap-1">
            <div
              className="relative cursor-pointer"
              role="button"
              onClick={handleImageClick}
              onKeyPress={(e) => e.key === "Enter" && handleImageClick(e)}
              tabIndex={0}
            >
              <img
                src={item.image}
                alt={item.name}
                className={`w-16 h-16 object-cover rounded-lg shadow-sm
                  ${!item.isAvailable && "opacity-50 grayscale"}
                  ${
                    item.isAvailable &&
                    "hover:opacity-90 transition-opacity duration-200"
                  }`}
              />
              <div className="absolute inset-0 rounded-lg shadow-inner" />
            </div>
            <button
              onClick={() => item.isAvailable && setSelectedItem(item)}
              disabled={!item.isAvailable}
              className={`w-16 text-xs py-1 rounded-full transition-colors duration-300
                ${
                  item.isAvailable
                    ? "bg-[#2C3539] text-white hover:bg-[#B8860B]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div
            ref={modalRef}
            className="relative max-w-4xl w-full mx-auto rounded-lg overflow-hidden bg-[#E8E3D9] p-1"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItem;
