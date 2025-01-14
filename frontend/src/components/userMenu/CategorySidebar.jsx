const CategorySidebar = ({ categories, selectedCategory, setSelectedCategory }) => (
    <aside className="md:w-64">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-[#333333] font-semibold mb-4">Categories</h2>
        <div className="flex flex-col gap-2">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg text-left transition-colors ${
                selectedCategory === category ? 'bg-[#2D6A4F] text-white' : 'hover:bg-[#F4F1DE]'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
  export default CategorySidebar;
  