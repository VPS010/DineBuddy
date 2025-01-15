import React, { useState } from "react";
import {
  Search,
  ShoppingBag,
  ChevronDown,
  LogOut,
  Menu,
  Leaf,
} from "lucide-react";

const Header = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  cartCount,
  setIsCartOpen,
  isLoggedIn,
  user,
  onLogout,
  isVegOnly,
  setIsVegOnly
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      {/* Premium gradient border */}
      <div className="h-1 bg-gradient-to-r from-[#B8860B] via-[#2D6A4F] to-[#800000]" />

      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top Section - Search and Cart */}
        <div className="flex items-center gap-4 mb-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search our menu..."
              className="w-full pl-10 pr-4 py-2 border border-[#E8E3D9] rounded-full bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 bg-[#2D6A4F] hover:bg-[#235A3F] text-white px-3 py-2 rounded-full shadow-sm transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-medium">{cartCount}</span>
          </button>
        </div>

        {/* Bottom Section - Filters and User */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Filter Dropdown */}
            <div className="relative max-w-[200px]">
              <select
                className="w-full appearance-none px-4 pr-10 py-2 border border-[#E8E3D9] rounded-full bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C3539] w-4 h-4 pointer-events-none" />
            </div>

            {/* Veg Filter Toggle */}
            <div className="flex items-center">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-[#FDFBF7] rounded-full border border-[#E8E3D9]">
                <Leaf
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    isVegOnly ? "text-[#2D6A4F]" : "text-gray-400"
                  }`}
                />
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isVegOnly}
                    onChange={() => setIsVegOnly(!isVegOnly)}
                  />
                  <div className="w-8 sm:w-11 h-4 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2D6A4F]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 sm:after:h-5 after:w-3 sm:after:w-5 after:transition-all peer-checked:bg-[#2D6A4F]"></div>
                  <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-[#2C3539]">
                    Veg
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* User Section */}
          {isLoggedIn && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#FDFBF7] rounded-full border border-[#E8E3D9]">
              <span className="text-sm text-[#2C3539] truncate max-w-[150px]">
                {user.email}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-[#800000] hover:text-[#9B2C2C]"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button - Only visible on very small screens */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed bottom-4 right-4 p-3 bg-[#2D6A4F] text-white rounded-full shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
