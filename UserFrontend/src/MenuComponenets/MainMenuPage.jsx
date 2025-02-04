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
  restaurantInfoState,
  geoFenceState,
} from "./store/atoms";
import Cart from "./MenuCart/Cart";
import Header from "./Header";
import CategoryMenu from "./CategorySidebar";
import MenuGrid from "./MenuGrid";
import AddToCartModal from "./AddToCartModal";

const MenuPage = () => {
  const [cart, setCart] = useRecoilState(cartState);
  const [menuData, setMenuData] = useRecoilState(menuDataState);
  const [selectedItem, setSelectedItem] = useRecoilState(selectedItemState);
  const [restaurantInfo, setRestaurantInfo] =
    useRecoilState(restaurantInfoState);
  const [geoFence, setGeoFence] = useRecoilState(geoFenceState);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const { restaurantId } = useParams();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table");

  // Enhanced menu fetching with error handling and data processing
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://dinebuddy.in/api/v1/user/menu/${restaurantId}`
        );

        if (response.data) {
          if (response.data.menu) {
            // Enhanced menu item processing with proper ID handling
            const processedMenu = response.data.menu.map((item) => ({
              ...item,
              id: item._id || item.id, // Ensure id is set from _id if needed
              itemId: item._id || item.itemId, // Ensure itemId is set from _id if needed
              dietary: item.dietary || [],
              ingredients: item.ingredients || [],
              customization: {
                spiceLevel: item.customization?.spiceLevel || [],
              },
              price: Number(item.price) || 0, // Ensure price is a number
            }));
            setMenuData(processedMenu);
          }

          if (response.data.restaurant) {
            setRestaurantInfo({
              name: response.data.restaurant.name || "",
              address: response.data.restaurant.address || "",
              contact: response.data.restaurant.contact || "",
              id: response.data.restaurant._id || restaurantId,
            });
          }

          if (response.data.restaurant?.geoFence) {
            setGeoFence({
              coordinates: response.data.restaurant.geoFence,
              isWithinBoundary: false,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError(
          err.response?.data?.error ||
            "Failed to fetch menu items. Please try refreshing the page."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenu();
    }
  }, [restaurantId, setMenuData, setRestaurantInfo, setGeoFence]);

  // Enhanced addToCart function with proper ID handling
  const addToCart = (item, customizations = {}, quantity = 1) => {
    if (!item._id && !item.id && !item.itemId) {
      console.error("Cannot add item to cart: Missing ID", item);
      return;
    }

    setCart((prevCart) => {
      // Check for existing item with same ID and customizations
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          (cartItem.id === item._id || cartItem.id === item.id) &&
          JSON.stringify(cartItem.customizations) ===
            JSON.stringify(customizations)
      );

      if (existingItemIndex !== -1) {
        // Create a new array and update the quantity of the existing item
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      // Add new item
      const cartItem = {
        ...item,
        id: item._id || item.id,
        itemId: item._id || item.itemId,
        quantity,
        customizations,
        cartId: `${item._id || item.id || item.itemId}-${Date.now()}`,
        price: Number(item.price) || 0,
      };

      return [...prevCart, cartItem];
    });

    setSelectedItem(null);
  };
  // Enhanced removeFromCart function
  const removeFromCart = (cartId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.cartId !== cartId);
      console.log("Cart after removal:", updatedCart); // Debug log
      return updatedCart;
    });
  };

  // Enhanced updateCartItemQuantity function
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
    <div className="flex flex-col min-h-screen">
      <Header cartCount={cart.length} />
      <CategoryMenu categories={categories} />
      <main className="flex flex-1 justify-center">
        <MenuGrid menuItems={menuData} onItemClick={setSelectedItem} />
      </main>
      <Cart
        updateCartItemQuantity={updateCartItemQuantity}
        removeFromCart={removeFromCart}
        tableNumber={tableNumber}
        restaurantId={restaurantId}
      />
      {selectedItem && (
        <AddToCartModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          addToCart={addToCart}
        />
      )}
    </div>
  );
};

export default MenuPage;
