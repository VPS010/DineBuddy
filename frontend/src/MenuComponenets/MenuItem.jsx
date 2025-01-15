import React from 'react';

const MenuItem = ({ item, setSelectedItem }) => {
  return (
    <div className="flex flex-row bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md border border-[#E8E3D9] hover:shadow-lg transition-shadow duration-300">
      {/* Left side with content */}
      <div className="flex-grow pr-2 sm:pr-4 md:pr-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          {/* Veg/Non-veg indicator with golden border */}
          <span 
            className={`w-4 h-4 sm:w-5 sm:h-5 border-2 ${
              item.isVeg 
                ? 'border-[#1c7d15]' 
                : 'border-[#8B3A3A]'
            } rounded-sm flex items-center justify-center shadow-sm`}
          >
            <span 
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                item.isVeg 
                  ? 'bg-[#1c7d15]' 
                  : 'bg-[#8B3A3A]'
              }`}
            />
          </span>
          
          {/* Item name and price */}
          <h3 className="text-[#2C3539] font-serif text-base sm:text-lg md:text-xl flex-grow line-clamp-1">
            {item.name}
          </h3>
          <span className="text-[#B8860B] font-serif text-base sm:text-lg md:text-xl whitespace-nowrap">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {/* Dietary tags with premium styling */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
          {item.dietary.map(diet => (
            <span
              key={diet}
              className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#F8F6F0] text-[#6B4423] text-xs font-medium rounded-full border border-[#E8E3D9]"
            >
              {diet}
            </span>
          ))}
        </div>

        {/* Description with elegant typography */}
        <p className="text-[#666] text-xs sm:text-sm leading-relaxed line-clamp-2 font-light">
          {item.description}
        </p>
      </div>

      {/* Right side with image and add button - Fixed width column */}
      <div className="flex flex-col gap-2 sm:gap-3 items-center ml-2 sm:ml-3 md:ml-4">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-lg shadow-md"
          />
          <div className="absolute inset-0 rounded-lg shadow-inner"></div>
        </div>
        <button
          onClick={() => setSelectedItem(item)}
          className="w-full text-xs sm:text-sm bg-[#2C3539] text-[#F8F6F0] px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full hover:bg-[#1F262A] transition-colors duration-300 font-medium shadow-sm hover:shadow whitespace-nowrap"
        >
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default MenuItem;