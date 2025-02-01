import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut } from "lucide-react";

const HeaderRight = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <button className="relative p-2 hover:bg-gray-100 rounded-lg">
        <Bell size={20} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img
            src="https://i.ibb.co/fzZrwZcv/38aa95f88d5f0fc3fc3fc0f691abfaeaf0c.jpg"
            alt="Admin"
            className="w-8 h-8 rounded-full"
          />
          <ChevronDown
            size={16}
            className={`text-gray-600 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderRight;
