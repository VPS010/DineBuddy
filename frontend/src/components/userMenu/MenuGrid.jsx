const MenuGrid = ({ menuData, setSelectedItem }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuData.map(item => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-[#333333] font-semibold mb-2">{item.name}</h3>
            <p className="text-sm text-[#A5A5A5] mb-4">{item.description}</p>
            <button
              onClick={() => setSelectedItem(item)}
              className="bg-[#2D6A4F] text-white px-4 py-2 rounded-lg hover:bg-[#36A89A]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  export default MenuGrid;
  