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

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/menu/${restaurantId}`
        );

        if (response.data) {
          // Set menu data
          if (response.data.menu) {
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

          // Set restaurant info
          if (response.data.restaurant) {
            setRestaurantInfo({
              name: response.data.restaurant.name || "",
              address: response.data.restaurant.address || "",
              contact: response.data.restaurant.contact || "",
            });
          }

          // Set geofence data
          if (response.data.restaurant?.geoFence) {
            setGeoFence({
              coordinates: response.data.restaurant.geoFence,
              isWithinBoundary: false,
            });
          }
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
  }, [restaurantId, setMenuData, setRestaurantInfo, setGeoFence]);

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
      <div className="flex flex-1">
        <CategoryMenu categories={categories} />
        <main className="flex flex-1 justify-center">
          <MenuGrid menuItems={menuData} onItemClick={setSelectedItem} />
        </main>
        <Cart
          updateCartItemQuantity={updateCartItemQuantity}
          removeFromCart={removeFromCart}
          tableNumber={tableNumber}
          // fenceCoordinates={fenceCoordinates}
        />
      </div>
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
