import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import Cart from "../MenuComponenets/Cart";
import Header from "../MenuComponenets/Header";
import CategoryMenu from "../MenuComponenets/CategorySidebar";
import MenuGrid from "../MenuComponenets/MenuGrid";
import AddToCartModal from "../MenuComponenets/AddToCartModal";

const MenuPage = () => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [originalMenuData, setOriginalMenuData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { restaurantId } = useParams();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table");

  // Fetch menu data from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/menu/${restaurantId}`
        );
        if (response.data && response.data.menu) {
          // Process menu items with correct structure
          const processedMenu = response.data.menu.map((item) => ({
            ...item,
            dietary: item.dietary || [],
            ingredients: item.ingredients || [],
            customization: {
              spiceLevel: item.customization?.spiceLevel || [],
            },
          }));
          setOriginalMenuData(processedMenu);
          setMenuData(processedMenu);
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError(err.response?.data?.error || "Failed to fetch menu items");
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenu();
    }
  }, [restaurantId]);

  useEffect(() => {
    let filtered = [...originalMenuData];

    if (isVegOnly) {
      filtered = filtered.filter((item) => item.isVeg);
    }

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
  }, [searchQuery, selectedCategory, sortBy, isVegOnly, originalMenuData]);

  const addToCart = (item, customizations = {}, quantity = 1) => {
    const cartItem = {
      ...item,
      quantity,
      customizations,
      cartId: `${item.id}-${Date.now()}`,
    };
    setCart((prevCart) => [...prevCart, cartItem]);
    setSelectedItem(null);
  };

  const removeFromCart = (cartId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const updateCartItemQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const categories = [
    "All",
    ...new Set(originalMenuData.map((item) => item.category)),
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F1DE] flex items-center justify-center">
        <p className="text-xl">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F1DE] flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

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
        tableNumber={tableNumber}
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
