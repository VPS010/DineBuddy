import React, { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import { Utensils, Leaf, ChevronDown } from "lucide-react";

const MenuGrid = ({ menuData, setSelectedItem, isVegOnly }) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  // Filter items based on veg preference
  const filteredMenuData = isVegOnly
    ? menuData.filter((item) => item.isVeg)
    : menuData;

  const groupedItems = filteredMenuData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Initialize all categories as expanded on mount
  useEffect(() => {
    const initialExpanded = Object.keys(groupedItems).reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {});
    setExpandedCategories(initialExpanded);
  }, [menuData, isVegOnly]); // Re-initialize when menu data or veg filter changes

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="w-full bg-[#FDFBF7] px-4 sm:px-6 lg:px-8">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={`category-${category}`} className="mb-8 sm:mb-12">
          {/* Category Header - Now Clickable */}
          <div 
            className="sticky top-0 bg-[#FDFBF7] z-10 py-4 sm:py-6 cursor-pointer hover:bg-[#F8F6F0] transition-colors duration-300"
            onClick={() => toggleCategory(category)}
          >
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-[#B8860B] to-transparent flex-grow mx-2 sm:mx-4" />
              {isVegOnly ? (
                <Leaf className="text-[#2D6A4F] w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Utensils className="text-[#B8860B] w-5 h-5 sm:w-6 sm:h-6" />
              )}
              <div className="h-px bg-gradient-to-r from-transparent via-[#B8860B] to-transparent flex-grow mx-2 sm:mx-4" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-center text-[#2C3539] mb-1 sm:mb-2">
                {category}
              </h2>
              <ChevronDown 
                className={`w-5 h-5 transition-transform duration-300 ${
                  expandedCategories[category] ? 'rotate-180' : ''
                }`}
              />
            </div>

            <p className="text-center text-xs sm:text-sm text-[#666] italic mb-3 sm:mb-4">
              {items.length} {isVegOnly ? "vegetarian" : ""} selections
            </p>

            <div className="absolute bottom-0 left-0 right-0 h-4 sm:h-6 bg-gradient-to-b from-[#FDFBF7] to-transparent" />
          </div>

          {/* Menu Items Container with Animation */}
          <div 
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              expandedCategories[category] ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-4 sm:space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-1 xl:grid-cols-2 p-2 sm:p-4 md:p-6 rounded-lg overflow-hidden bg-gradient-to-b from-[#F8F6F0] to-[#FDFBF7]">
              {items.map((item) => (
                <MenuItem
                  key={item._id || `menu-item-${item.id}-${Date.now()}`}
                  item={item}
                  setSelectedItem={setSelectedItem}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Empty state handling */}
      {filteredMenuData.length === 0 && (
        <div className="text-center py-12">
          <Leaf className="mx-auto w-12 h-12 text-[#2D6A4F] opacity-50 mb-4" />
          <h3 className="text-lg font-medium text-[#2C3539] mb-2">
            {isVegOnly ? "No vegetarian items found" : "No items found"}
          </h3>
          <p className="text-[#666]">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuGrid;