import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import axios from "axios";
import { cartState, isCartOpenState } from "../store/atoms";
import { X } from "lucide-react";
import { CartItem } from "./CartItem";
import OrderedItem from "./OrderedItem";
import { CartSummary } from "./CartSummary";
import { ConfirmationDialog } from "./ConfirmationDialog";
import LocationVerification from "./LocationVerification";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((request) => {
  console.log("Starting Request:", request);
  return request;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.log("Response Error:", error);
    return Promise.reject(error);
  }
);

const Cart = ({
  updateCartItemQuantity: externalUpdateCartItemQuantity,
  removeFromCart,
  tableNumber,
  restaurantId,
}) => {
  const cartRef = useRef(null);
  const [cart, setCart] = useRecoilState(cartState);
  const [isCartOpen, setIsCartOpen] = useRecoilState(isCartOpenState);
  const [orderedItems, setOrderedItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlacementDialog, setOrderPlacementDialog] = useState({
    isOpen: false,
    message: "",
    title: "",
  });

  const handleOrderPlacement = async () => {
    if (isLoading) {
      toast.info("Please wait while we process your request...");
      return;
    }

    try {
      // Validate cart items before proceeding
      const invalidItems = cart.filter((item) => {
        const itemId = item.itemId || item._id || item.id;
        return !itemId;
      });

      if (invalidItems.length > 0) {
        throw new Error(
          `Found ${invalidItems.length} invalid items in cart. Each item must have an ID.`
        );
      }

      const currentSessionId = sessionId || (await getOrCreateSession());
      if (!currentSessionId) {
        throw new Error("Unable to create session");
      }

      const orderResponse = await createOrUpdateOrder(currentSessionId, cart);
      await fetchOrderedItems();
      setCart([]);

      setOrderPlacementDialog({
        isOpen: true,
        title: sessionId ? "Added to your Order" : "Order Placed",
        message: sessionId
          ? "We updated the kitchen to prepare your additional items."
          : "Your order has been placed! The kitchen will start preparing your items.",
      });

      toast.success(orderResponse.message || "Order processed successfully!");
    } catch (error) {
      handleApiError(error, "Error placing order. Please try again.");
    }
  };

  const locationVerification = LocationVerification({
    onLocationVerified: handleOrderPlacement,
    onLocationDenied: () => {
      toast.info("Order cancelled due to location verification.");
    },
  });

  const fetchOrderedItems = async () => {
    try {
      if (!tableNumber || !restaurantId) {
        console.warn("Table number and restaurant ID required to fetch orders");
        return;
      }

      const response = await api.get(
        `/user/order/${restaurantId}/${tableNumber}`
      );

      if (response.data?.order?.items) {
        setOrderedItems(response.data.order.items);
        if (response.data.order.sessionId) {
          setSessionId(response.data.order.sessionId);
        }
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        handleApiError(error, "Failed to fetch ordered items");
      }
    }
  };

  useEffect(() => {
    fetchOrderedItems();
  }, [tableNumber, restaurantId]);

  const getOrCreateSession = async () => {
    setIsLoading(true);
    try {
      if (!tableNumber || !restaurantId) {
        throw new Error("Table number and restaurant ID are required");
      }

      const response = await api.post("/user/session", {
        tableNumber,
        restaurantId,
      });

      const sessionData = response.data?.tableStatus;

      if (!sessionData?.sessionId) {
        throw new Error("Invalid session data received from server");
      }

      setSessionId(sessionData.sessionId);

      if (response.status === 201) {
        toast.success(response.data.message);
      }

      return sessionData.sessionId;
    } catch (error) {
      handleApiError(error, "Failed to create session");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (error, defaultMessage) => {
    if (error.response) {
      const errorMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        defaultMessage;
      toast.error(errorMessage);
      console.error("Server Error Details:", error.response.data);
    } else if (error.request) {
      toast.error(
        "Unable to connect to the server. Please check your internet connection."
      );
      console.error("Network Error:", error.request);
    } else {
      toast.error(error.message || defaultMessage);
      console.error("Request Error:", error);
    }
  };

  const createOrUpdateOrder = async (sessionId, items) => {
    setIsLoading(true);
    try {
      if (!items?.length) {
        throw new Error("No items to order");
      }

      const formattedItems = items.map((item) => {
        const itemId = item.itemId || item._id || item.id;
        if (!itemId) {
          throw new Error(`Item "${item.name}" is missing a required ID`);
        }

        return {
          itemId: itemId.toString(), // Ensure ID is a string
          quantity: parseInt(item.quantity) || 1,
          spiceLevel: item.customizations?.spiceLevel || "Medium",
        };
      });

      const response = await api.post("/user/order", {
        tableNumber,
        restaurantId,
        sessionId,
        items: formattedItems,
      });

      if (!response.data) {
        throw new Error("No data received from server");
      }

      return response.data;
    } catch (error) {
      console.error("Error creating/updating order:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const consolidateCart = (items) => {
    const consolidatedMap = new Map();

    items.forEach((item) => {
      // Standardize ID handling
      const itemId = item.itemId || item._id || item.id;
      if (!itemId) {
        console.warn(`Item "${item.name}" missing ID`);
        return;
      }

      const key = `${itemId}-${JSON.stringify(item.customizations || {})}`;

      if (consolidatedMap.has(key)) {
        const existingItem = consolidatedMap.get(key);
        consolidatedMap.set(key, {
          ...existingItem,
          quantity: existingItem.quantity + (item.quantity || 1),
        });
      } else {
        consolidatedMap.set(key, {
          ...item,
          itemId: itemId, // Standardize to itemId
          quantity: item.quantity || 1,
        });
      }
    });

    return Array.from(consolidatedMap.values());
  };
  useEffect(() => {
    if (cart.length > 0) {
      const consolidated = consolidateCart(cart);
      if (JSON.stringify(consolidated) !== JSON.stringify(cart)) {
        setCart(consolidated);
      }
    }
  }, [cart]);

  const updateCartItemQuantity = (cartId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.cartId === cartId ? { ...item, quantity: newQuantity } : item
    );
    setCart(consolidateCart(updatedCart));
    externalUpdateCartItemQuantity(cartId, newQuantity);
  };

  const handleConfirmRemove = () => {
    removeFromCart(itemToRemove);
    setDialogOpen(false);
    setItemToRemove(null);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cannot place an empty order.");
      return;
    }
    locationVerification.startVerification();
  };

  const calculateCartTotal = (items) => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity);

      if (isNaN(price) || isNaN(quantity)) {
        console.warn(`Invalid price or quantity for item: ${item.name}`);
        return total;
      }

      return total + price * quantity;
    }, 0);
  };

  const subtotal = calculateCartTotal(cart);
  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if cart is open and click is outside the cart
      if (
        isCartOpen &&
        cartRef.current &&
        !cartRef.current.contains(event.target)
      ) {
        // Prevent closing if clicking on elements that should open the cart
        const isCartTrigger = event.target.closest(
          '[data-cart-trigger="true"]'
        );
        if (!isCartTrigger) {
          setIsCartOpen(false);
        }
      }
    };

    // Add event listener when cart is open
    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, setIsCartOpen]);

  return (
    <div
      ref={cartRef}
      className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      <div className="flex flex-col h-full">
        <div className="sticky top-0 p-4 border-b border-[#E8E1D3] flex justify-between items-center bg-[#F9F6F0]">
          <h2 className="text-[#2D3436] font-semibold text-lg">Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#2D3436] hover:bg-[#E8E1D3] rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-[#2D3436] mb-4">
              New Items
            </h3>
            {cart.length > 0 ? (
              cart.map((item) => (
                <CartItem
                  key={item.cartId}
                  item={item}
                  updateCartItemQuantity={updateCartItemQuantity}
                  showRemoveDialog={(id) => {
                    setItemToRemove(id);
                    setDialogOpen(true);
                  }}
                />
              ))
            ) : (
              <p className="text-[#666666] text-center">Your cart is empty.</p>
            )}
          </div>

          <div className="p-4 border-t border-[#E8E1D3]">
            <h3 className="text-lg font-semibold text-[#2D3436] mb-4">
              Ordered Items
            </h3>
            {orderedItems.length > 0 ? (
              orderedItems.map((item) => (
                <OrderedItem key={item.itemId} item={item} />
              ))
            ) : (
              <p className="text-[#666666] text-center">
                No items ordered yet.
              </p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[#E8E1D3]">
          <CartSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
            onPlaceOrder={handlePlaceOrder}
            isLoading={isLoading}
          />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={dialogOpen}
        title="Remove Item"
        message="Are you sure you want to remove this item?"
        onConfirm={handleConfirmRemove}
        onCancel={() => setDialogOpen(false)}
        confirmText="Remove"
        confirmButtonClass="bg-[#9E2A2F] hover:bg-[#8E1A1F]"
      />

      <ConfirmationDialog
        isOpen={orderPlacementDialog.isOpen}
        title={orderPlacementDialog.title}
        message={orderPlacementDialog.message}
        onConfirm={() =>
          setOrderPlacementDialog({ ...orderPlacementDialog, isOpen: false })
        }
        confirmText="OK"
        confirmButtonClass="bg-[#4CAF50] hover:bg-[#45a049]"
        showCancel={false}
      />

      {locationVerification.dialog}
    </div>
  );
};

export default Cart;
