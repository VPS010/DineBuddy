import React, { useState, useEffect } from "react";

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


// Get unique categories from menu items
const uniqueCategories = ["All", ...new Set(menuItems.map(item => item.category))];

const MenuPage2 = () => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [menuData, setMenuData] = useState(menuItems);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: ""
  });
  const [itemToAddAfterLogin, setItemToAddAfterLogin] = useState(null);

  // Filter and sort menu items
  useEffect(() => {
    let filtered = [...menuItems];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
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

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginModal(false);
    
    if (itemToAddAfterLogin) {
      setSelectedItem(itemToAddAfterLogin);
      setItemToAddAfterLogin(null);
    }
  };

  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">Login Required</h3>
        <p className="text-gray-600 mb-4">Please log in to add items to your cart.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={loginCredentials.email}
              onChange={(e) =>
                setLoginCredentials((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={loginCredentials.password}
              onChange={(e) =>
                setLoginCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              required
            />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowLoginModal(false);
                setItemToAddAfterLogin(null);
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2D6A4F] text-white rounded-md hover:bg-[#36A89A]"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const AddToCartModal = ({ item }) => {
    const [quantity, setQuantity] = useState(1);
    const [customizations, setCustomizations] = useState({});

    const handleAdd = () => {
      const cartItem = {
        ...item,
        quantity,
        customizations,
        cartId: `${item.id}-${Date.now()}`
      };

      setCart(prevCart => [...prevCart, cartItem]);
      setSelectedItem(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-[#333333] font-semibold text-lg mb-4">{item.name}</h3>

          {item.customization &&
            Object.entries(item.customization).map(([key, options]) => (
              <div key={key} className="mb-4">
                <label className="block text-[#333333] mb-2 capitalize">{key}</label>
                <select
                  className="w-full p-2 border border-[#E0E0E0] rounded-lg"
                  onChange={(e) =>
                    setCustomizations((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                >
                  <option value="">Select {key}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

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
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const updateCartItemQuantity = (cartId, newQuantity) => {
      if (newQuantity < 1) return;
      setCart(prevCart =>
        prevCart.map(item =>
          item.cartId === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    };

    const removeFromCart = (cartId) => {
      setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
    };

    const CartItem = ({ item }) => (
      <div className="flex items-center gap-4 p-4 border-b border-[#E0E0E0]">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h4 className="text-[#333333] font-semibold">{item.name}</h4>
          {item.customizations &&
            Object.entries(item.customizations).map(([key, value]) => (
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

    return (
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg transform transition-transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
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
              cart.map((item) => <CartItem key={item.cartId} item={item} />)
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
              <button className="w-full py-3 bg-[#9E2A2F] text-white rounded-lg hover:bg-[#E63946] transition-colors">
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
                <option value="popularity">
                Popularity</option>
              </select>

              <select
                className="px-4 py-2 border border-[#E0E0E0] rounded-lg bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <button
                className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#36A89A]"
                onClick={() => setIsCartOpen(true)}
              >
                Cart
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuData.map((item) => (
            <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#333333]">{item.name}</h3>
                <p className="text-sm text-[#A5A5A5]">{item.category}</p>
                <p className="text-sm text-[#777777] mt-2">{item.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-semibold text-[#2D6A4F]">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => {
                      if (isLoggedIn) {
                        setSelectedItem(item);
                      } else {
                        setItemToAddAfterLogin(item);
                        setShowLoginModal(true);
                      }
                    }}
                    className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#36A89A]"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showLoginModal && <LoginModal />}
      {selectedItem && <AddToCartModal item={selectedItem} />}
      {isCartOpen && <Cart />}
    </div>
  );
};

export default MenuPage2;
