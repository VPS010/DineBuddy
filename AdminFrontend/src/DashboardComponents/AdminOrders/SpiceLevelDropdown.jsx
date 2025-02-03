import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

const SpiceLevelDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const spiceLevels = ['Mild', 'Medium', 'Spicy'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const updatePosition = () => {
      if (buttonRef.current && isOpen) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const menuHeight = 120; // Approximate height of the dropdown

        // Check if there's more space above or below
        const spaceBelow = windowHeight - buttonRect.bottom;
        const showAbove = spaceBelow < menuHeight && buttonRect.top > spaceBelow;

        setPosition({
          top: showAbove ? buttonRect.top - menuHeight : buttonRect.bottom,
          left: buttonRect.left,
          width: buttonRect.width,
          showAbove
        });
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updatePosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", updatePosition);

    if (isOpen) {
      updatePosition();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div ref={buttonRef}>
        <button
          className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border rounded-md"
          onClick={handleOpen}
          type="button"
        >
          {value} <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] bg-white border rounded-md shadow-lg"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
            }}
          >
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
          </div>,
          document.body
        )}
    </>
  );
};

export default SpiceLevelDropdown;