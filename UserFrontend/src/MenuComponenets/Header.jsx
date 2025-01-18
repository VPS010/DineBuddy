import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  searchQueryState,
  sortByState,
  isCartOpenState,
  isVegOnlyState,
  restaurantInfoState
} from "./store/atoms";
import {
  Search,
  ShoppingBag,
  ChevronDown,
  Menu,
  Leaf,
  UtensilsCrossed,
} from "lucide-react";

const Header = ({ cartCount }) => {
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [sortBy, setSortBy] = useRecoilState(sortByState);
  const [isCartOpen, setIsCartOpen] = useRecoilState(isCartOpenState);
  const [isVegOnly, setIsVegOnly] = useRecoilState(isVegOnlyState);
  const restaurantInfo = useRecoilValue(restaurantInfoState);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      {/* Premium gradient border */}
      <div className="h-1 bg-gradient-to-r from-[#B8860B] via-[#2D6A4F] to-[#800000]" />

      {/* Restaurant Branding Section */}
      <div className="bg-gradient-to-r justify-center flex from-[#2D6A4F] to-[#1A472F] py-2.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UtensilsCrossed className="text-[#B8860B] w-7 h-7" />
            <div>
              <h1 className="text-xl font-semibold text-white">
              {restaurantInfo.name}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="text-[#B8860B] text-sm font-medium">
                  Powered by
                </span>
                <span className="text-white text-sm font-semibold">Servit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 bg-white">
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
            className="flex items-center gap-1.5 bg-[#2D6A4F] hover:bg-[#235A3F] text-white px-4 py-2 rounded-full shadow-sm transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-medium">{cartCount}</span>
          </button>
        </div>

        {/* Bottom Section - Filters */}
        <div className="flex items-center gap-4">
          {/* Filter Dropdown */}
          <div className="relative w-48">
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
            <div className="flex items-center gap-2 px-4 py-2 bg-[#FDFBF7] rounded-full border border-[#E8E3D9]">
              <Leaf
                className={`w-4 h-4 ${
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
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2D6A4F]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2D6A4F]"></div>
                <span className="ml-2 text-sm font-medium text-[#2C3539]">
                  Veg
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
