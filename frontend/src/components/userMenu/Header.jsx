import React from 'react';

const Header = ({ searchQuery, setSearchQuery, sortBy, setSortBy, cartLength, setIsCartOpen }) => (
  <header className="bg-white shadow-md sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search menu..."
          className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#2D6A4F]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border border-[#E0E0E0] rounded-lg bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popularity">Popularity</option>
          </select>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#2D6A4F] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            Cart ({cartLength})
          </button>
        </div>
      </div>
    </div>
  </header>
);
export default Header;
