import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import {
  cartState,
  menuDataState,
  isCartOpenState,
  selectedItemState,
  isVegOnlyState,
} from "./store/atoms";
import Cart from "./Cart";
import Header from "./Header";
import CategoryMenu from "./CategorySidebar";
import MenuGrid from "./MenuGrid";
import AddToCartModal from "./AddToCartModal";

const MenuPage = () => {
  const [cart, setCart] = useRecoilState(cartState);
  const [menuData, setMenuData] = useRecoilState(menuDataState);
  const [isCartOpen, setIsCartOpen] = useRecoilState(isCartOpenState);
  const [selectedItem, setSelectedItem] = useRecoilState(selectedItemState);
  const [isVegOnly] = useRecoilState(isVegOnlyState);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const { restaurantId } = useParams();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/menu/${restaurantId}`
        );
        if (response.data && response.data.menu) {
          const processedMenu = response.data.menu.map((item) => ({
            ...item,
            dietary: item.dietary || [],
            ingredients: item.ingredients || [],
            customization: {
              spiceLevel: item.customization?.spiceLevel || [],
            },
          }));
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
  }, [restaurantId, setMenuData]);

  const addToCart = (item, customizations = {}, quantity = 1) => {
    setCart((prevCart) => {
      // Check if exact same item with same customizations exists
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem._id === item._id &&
          JSON.stringify(cartItem.customizations) ===
            JSON.stringify(customizations)
      );

      if (existingItem) {
        // Update quantity of existing item
        return prevCart.map((cartItem) =>
          cartItem._id === item._id &&
          JSON.stringify(cartItem.customizations) ===
            JSON.stringify(customizations)
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      // Add as new item
      const newItem = {
        ...item,
        quantity,
        customizations,
        cartId: `${item._id}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
      };

      const newCart = [...prevCart, newItem];
      return newCart;
    });

    setSelectedItem(null);
  };

  const removeFromCart = (cartId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const updateCartItemQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const categories = ["All", ...new Set(menuData.map((item) => item.category))];

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
      <Header cartCount={cart.length} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <CategoryMenu categories={categories} />
          <MenuGrid />
        </div>
      </main>
      <Cart
        updateCartItemQuantity={updateCartItemQuantity}
        removeFromCart={removeFromCart}
        tableNumber={tableNumber}
      />
      {selectedItem && <AddToCartModal addToCart={addToCart} />}
    </div>
  );
};

export default MenuPage;
