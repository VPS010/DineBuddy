import React, { useState, useEffect } from 'react';
import Cart from '../MenuComponenets/Cart';
import Header from '../MenuComponenets/Header';
import CategoryMenu from '../MenuComponenets/CategorySidebar';
import MenuGrid from '../MenuComponenets/MenuGrid';
import AddToCartModal from '../MenuComponenets/AddToCartModal';

const menuItems = [
    {
      id: 1,
      name: "Grilled Salmon",
      category: "Main Course",
      price: 24.99,
      description: "Fresh Atlantic salmon grilled to perfection with herbs",
      image: "/api/placeholder/300/200",
      dietary: ["Gluten-Free"],
      isVeg: true,
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
      price: 18.99,
      description: "Classic Caesar salad with romaine lettuce and house-made dressing",
      ingredients: ["Romaine", "Croutons", "Parmesan", "Caesar Dressing"],
      image: "/api/placeholder/300/200",
      isVeg: false,
      dietary: ["Vegetarian"],
      customization: {
        addOns: ["Chicken", "Shrimp", "Extra Cheese"]
      },
      popularity: 4.2
    },
    {
      id: 3,
      name: "Caesar Salad",
      category: "Appetizers",
      price: 17.99,
      description: "Classic Caesar salad with romaine lettuce and house-made dressing",
      ingredients: ["Romaine", "Croutons", "Parmesan", "Caesar Dressing"],
      image: "/api/placeholder/300/200",
      isVeg: true,
      dietary: ["Vegetarian"],
      customization: {
        addOns: ["Chicken", "Shrimp", "Extra Cheese"]
      },
      popularity: 4.2
    },
    {
      id: 4,
      name: "Caesar Salad",
      category: "Appetizers",
      price: 18.99,
      description: "Classic Caesar salad with romaine lettuce and house-made dressing",
      ingredients: ["Romaine", "Croutons", "Parmesan", "Caesar Dressing"],
      image: "/api/placeholder/300/200",
      isVeg: false,
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
  const [isVegOnly, setIsVegOnly] = useState(false);

  useEffect(() => {
    let filtered = [...menuItems];
    
    // Apply veg filter
    if (isVegOnly) {
      filtered = filtered.filter(item => item.isVeg);
    }
    
    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
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
  }, [searchQuery, selectedCategory, sortBy, isVegOnly]);

  const addToCart = (item, customizations = {}, quantity = 1) => {
    const cartItem = {
      ...item,
      quantity,
      customizations,
      cartId: `${item.id}-${Date.now()}`
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

  return (
    <div className="min-h-screen bg-[#F4F1DE]">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        cartCount={cart.length}
        setIsCartOpen={setIsCartOpen}
        isVegOnly={isVegOnly}
        setIsVegOnly={setIsVegOnly}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <CategoryMenu 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <MenuGrid 
            menuData={menuData}
            setSelectedItem={setSelectedItem}
            isVegOnly={isVegOnly}
          />
        </div>
      </main>

      <Cart 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        updateCartItemQuantity={updateCartItemQuantity}
        removeFromCart={removeFromCart}
      />

      {selectedItem && (
        <AddToCartModal 
          item={selectedItem}
          addToCart={addToCart}
          setSelectedItem={setSelectedItem}
        />
      )}
    </div>
  );
};

export default MenuPage;