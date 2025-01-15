import React, { useState, useEffect } from 'react';


// Sample menu data
const menuItems = [
  {
    id: 1,
    name: "Grilled Salmon",
    category: "Main Course",
    price: 24.99,
    description: "Fresh Atlantic salmon grilled to perfection with herbs",
    ingredients: ["Salmon", "Herbs", "Lemon", "Olive Oil"],
    image: "/api/placeholder/300/200",
    dietary: ["Gluten-Free"],
    customization: {
      spiceLevel: ["Mild", "Medium", "Spicy"],
      sides: ["Rice", "Vegetables", "Potatoes"]
    },
    popularity: 4.5
  },
  {
    id: 2,
    name: "Caesar Salad",
    category: "Appetizers",
    price: 12.99,
    description: "Classic Caesar salad with romaine lettuce and house-made dressing",
    ingredients: ["Romaine", "Croutons", "Parmesan", "Caesar Dressing"],
    image: "/api/placeholder/300/200",
    dietary: ["Vegetarian"],
    customization: {
      addOns: ["Chicken", "Shrimp", "Extra Cheese"]
    },
    popularity: 4.2
  }
];

const MenuPage = () => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [menuData, setMenuData] = useState(menuItems);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter and sort menu items
  useEffect(() => {
    let filtered = [...menuItems];
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "popularity":
          return b.popularity - a.popularity;
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    setMenuData(filtered);
  }, [searchQuery, selectedCategory, sortBy]);

  const addToCart = (item, customizations = {}, quantity = 1) => {
    const cartItem = {
      ...item,
      quantity,
      customizations,
      cartId: `${item.id}-${Date.now()}` // Unique ID for cart items
    };

    setCart(prevCart => [...prevCart, cartItem]);
    setSelectedItem(null);
  };

  const removeFromCart = (cartId) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  const updateCartItemQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const categories = ["All", ...new Set(menuItems.map(item => item.category))];

  const CartItem = ({ item }) => (
    <div className="flex items-center gap-4 p-4 border-b border-[#E0E0E0]">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="text-[#333333] font-semibold">{item.name}</h4>
        {item.customizations && Object.entries(item.customizations).map(([key, value]) => (
          <p key={key} className="text-sm text-[#A5A5A5]">
            {key}: {value}
          </p>
        ))}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateCartItemQuantity(item.cartId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center bg-[#F4F1DE] rounded-full hover:bg-[#E0E0E0]"
            >
              -
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => updateCartItemQuantity(item.cartId, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-[#F4F1DE] rounded-full hover:bg-[#E0E0E0]"
            >
              +
            </button>
          </div>
          <span className="text-[#2D6A4F] font-semibold">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.cartId)}
        className="text-[#9E2A2F] hover:text-[#E63946]"
      >
        Remove
      </button>
    </div>
  );


  
  const AddToCartModal = ({ item }) => {
    const [quantity, setQuantity] = useState(1);
    const [customizations, setCustomizations] = useState({});

    const handleAdd = () => {
      addToCart(item, customizations, quantity);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-[#333333] font-semibold text-lg mb-4">{item.name}</h3>
          
          {/* Customization Options */}
          {item.customization && Object.entries(item.customization).map(([key, options]) => (
            <div key={key} className="mb-4">
              <label className="block text-[#333333] mb-2 capitalize">{key}</label>
              <select
                className="w-full p-2 border border-[#E0E0E0] rounded-lg"
                onChange={(e) => setCustomizations(prev => ({
                  ...prev,
                  [key]: e.target.value
                }))}
              >
                <option value="">Select {key}</option>
                {options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-[#333333] mb-2">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center bg-[#F4F1DE] rounded-full"
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center bg-[#F4F1DE] rounded-full"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setSelectedItem(null)}
              className="px-4 py-2 text-[#333333] hover:bg-[#F4F1DE] rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#36A89A]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };



  const Cart = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
      <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg transform transition-transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-[#E0E0E0] flex justify-between items-center">
            <h2 className="text-[#333333] font-semibold text-lg">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-[#333333] hover:text-[#9E2A2F]"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="p-4 text-center text-[#A5A5A5]">
                Your cart is empty
              </div>
            ) : (
              cart.map(item => (
                <CartItem key={item.cartId} item={item} />
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-[#E0E0E0]">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-[#A5A5A5]">Subtotal</span>
                  <span className="text-[#333333]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#A5A5A5]">Tax</span>
                  <span className="text-[#333333]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-[#2D6A4F]">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                className="w-full py-3 bg-[#9E2A2F] text-white rounded-lg hover:bg-[#E63946] transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-[#F4F1DE]">



      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search menu..."
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
                <span>Cart ({cart.length})</span>
              </button>
            </div>
          </div>
        </div>
      </header>



      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">



          {/* Category Sidebar */}
          <aside className="md:w-64">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-[#333333] font-semibold mb-4">Categories</h2>
              <div className="flex flex-col gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#2D6A4F] text-white'
                        : 'hover:bg-[#F4F1DE]'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>



          {/* Menu Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuData.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[#333333] font-semibold">{item.name}</h3>
                      <span className="text-[#2D6A4F] font-bold">${item.price}</span>
                    </div>
                    <p className="text-[#A5A5A5] text-sm mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {item.dietary.map(diet => (
                          <span
                            key={diet}
                            className="px-2 py-1 bg-[#F4F1DE] text-[#2D6A4F] text-xs rounded-full"
                          >
                                                      {diet}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="bg-[#2D6A4F] text-white px-4 py-2 rounded-lg hover:bg-[#36A89A]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Cart Modal */}
      {isCartOpen && <Cart />}

      {/* Add to Cart Modal */}
      {selectedItem && <AddToCartModal item={selectedItem} />}
    </div>
  );
};

export default MenuPage;
