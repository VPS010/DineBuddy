// SpiceLevelDropdown.jsx
import React, { useState, useRef, useEffect } from "react"; // Add missing imports
import { ChevronDown } from "lucide-react";

const SpiceLevelDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Initialize the ref

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  const spiceLevels = ['Mild', 'Medium', 'Spicy'];

  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border rounded-md"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {value} <ChevronDown className="w-4 h-4 ml-2" />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {spiceLevels.map((level) => (
            <div
              key={level}
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(level);
                setIsOpen(false);
              }}
            >
              {level}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpiceLevelDropdown;