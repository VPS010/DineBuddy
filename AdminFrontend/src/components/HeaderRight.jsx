import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut } from "lucide-react";

const HeaderRight = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unpaidOrders, setUnpaidOrders] = useState(0);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const dropdownRef = useRef(null);
  const [audio] = useState(new Audio("/notification-alert-269289.mp3")); // Create audio instance once
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const playNotificationSound = async () => {
    try {
      // Reset audio to start
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  };

  // Fetch unpaid orders
  useEffect(() => {
    const fetchUnpaidOrders = async () => {
      try {
        const response = await fetch("https://dinebuddy.in/api/v1/admin/orders", {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        });
        const data = await response.json();
        const unpaidCount = data.data.filter(order => order.paymentStatus === "Unpaid").length;
        
        // Play sound if new unpaid orders arrived
        if (unpaidCount > previousOrderCount) {
          playNotificationSound();
        }
        
        setPreviousOrderCount(unpaidCount);
        setUnpaidOrders(unpaidCount);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    // Initial fetch
    fetchUnpaidOrders();

    // Set up polling interval
    const interval = setInterval(fetchUnpaidOrders, 3000);

    return () => clearInterval(interval);
  }, [previousOrderCount, audio]);

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
        {unpaidOrders > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unpaidOrders}
          </span>
        )}
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