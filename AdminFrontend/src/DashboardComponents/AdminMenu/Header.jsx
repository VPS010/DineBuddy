import React from "react";
import { Search, Plus, Filter } from "lucide-react";

const MenuHeader = ({
  searchTerm,
  onSearchChange,
  onAddNewCategory,
  categories,
  selectedCategory,
  onCategoryChange,
  onAddNew,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, category, or dietary..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full md:w-72"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button
            onClick={onAddNewCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Categories
          </button>
          <button
            onClick={onAddNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Item
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === "all" ? "bg-gray-200" : "bg-gray-100"
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category ? "bg-blue-200" : "bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-4 py-2 rounded-lg ${
              activeFilter === "all" ? "bg-gray-200" : "bg-gray-100"
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => onFilterChange("available")}
            className={`px-4 py-2 rounded-lg ${
              activeFilter === "available" ? "bg-blue-200" : "bg-gray-100"
            }`}
          >
            Available
          </button>
          <button
            onClick={() => onFilterChange("unavailable")}
            className={`px-4 py-2 rounded-lg ${
              activeFilter === "unavailable" ? "bg-red-200" : "bg-gray-100"
            }`}
          >
            Unavailable
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange("veg")}
            className={`px-4 py-2 rounded-lg ${
              activeFilter === "veg" ? "bg-blue-200" : "bg-gray-100"
            }`}
          >
            Vegetarian
          </button>
          <button
            onClick={() => onFilterChange("nonveg")}
            className={`px-4 py-2 rounded-lg ${
              activeFilter === "nonveg" ? "bg-red-200" : "bg-gray-100"
            }`}
          >
            Non-Vegetarian
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange("bestseller")}
            className={`px-4 py-2 rounded-lg ${
              activeFilter === "bestseller" ? "bg-purple-200" : "bg-gray-100"
            }`}
          >
            Best Sellers
          </button>
          <button
            onClick={() => onFilterChange("trending")}
            className={`px-4 py-2 rounded-lg ${
              activeFilter === "trending" ? "bg-purple-200" : "bg-gray-100"
            }`}
          >
            Trending
          </button>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default MenuHeader;
