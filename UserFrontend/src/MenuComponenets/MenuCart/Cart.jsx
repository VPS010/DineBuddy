import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import axios from "axios";
import { cartState, isCartOpenState } from "../store/atoms";
import { X } from "lucide-react";
import { CartItem } from "./CartItem";
import { OrderedItem } from "./OrderedItem";
import { CartSummary } from "./CartSummary";
import { ConfirmationDialog } from "./ConfirmationDialog";
import LocationVerification from "./LocationVerification";

// Create axios instance with base URL, default headers, and timeout
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for logging
api.interceptors.request.use((request) => {
  console.log("Starting Request:", request);
  return request;
});

// Add response interceptor for logging
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

  // Initialize LocationVerification hook
  const locationVerification = LocationVerification({
    onLocationVerified: handleOrderPlacement,
    onLocationDenied: () => {
      toast.info("Order cancelled due to location verification.");
    },
  });

  // Function to fetch ordered items
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

        // If we get a sessionId from the order, update it
        if (response.data.order.sessionId) {
          setSessionId(response.data.order.sessionId);
        }
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        // Don't show error for 404 as it's expected when no orders exist
        handleApiError(error, "Failed to fetch ordered items");
      }
    }
  };

  // Add useEffect to fetch ordered items when component mounts and after new orders
  useEffect(() => {
    fetchOrderedItems();
  }, [tableNumber, restaurantId]);

  // Function to create or get session
  const getOrCreateSession = async () => {
    setIsLoading(true);
    try {
      if (!tableNumber || !restaurantId) {
        throw new Error("Table number and restaurant ID are required");
      }

      console.log("Sending session request with:", {
        tableNumber,
        restaurantId,
      });

      const response = await api.post("/user/session", {
        tableNumber,
        restaurantId,
      });

      const sessionData = response.data?.tableStatus;

      if (!sessionData?.sessionId) {
        console.error("Invalid session response:", response.data);
        throw new Error("Invalid session data received from server");
      }

      console.log("Session created successfully:", sessionData);
      setSessionId(sessionData.sessionId);

      // Show success message if it's a new session
      if (response.status === 201) {
        toast.success(response.data.message);
      }

      return sessionData.sessionId;
    } catch (error) {
      console.error("Error creating session:", error);
      handleApiError(error, "Failed to create session");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle API errors
  const handleApiError = (error, defaultMessage) => {
    if (error.response) {
      // Server responded with error status
      const errorMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        defaultMessage;
      toast.error(errorMessage);
      console.error("Server Error Details:", error.response.data);
    } else if (error.request) {
      // Request made but no response received
      toast.error(
        "Unable to connect to the server. Please check your internet connection."
      );
      console.error("Network Error:", error.request);
    } else {
      // Error in request setup
      toast.error(error.message || defaultMessage);
      console.error("Request Error:", error);
    }
  };

  // Function to create or update order
  const createOrUpdateOrder = async (sessionId, items) => {
    setIsLoading(true);
    try {
      if (!items.length) {
        throw new Error("No items to order");
      }

      const formattedItems = items.map((item, index) => {
        // Enhanced ID handling
        const itemId = item.itemId || item._id || item.id;

        if (!itemId) {
          throw new Error(
            `Item "${item.name}" (at position ${index}) is missing a required ID`
          );
        }

        return {
          itemId,
          name: item.name,
          quantity: item.quantity,
          spiceLevel: item.customizations?.spiceLevel || "Medium",
          status: "Pending",
          price: item.price,
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

  // Function to consolidate cart items
  const consolidateCart = (items) => {
    const consolidatedMap = new Map();

    items.forEach((item) => {
      const key = `${item.name}-${item._id || item.itemId}-${JSON.stringify(
        item.customizations
      )}`;

      if (consolidatedMap.has(key)) {
        const existingItem = consolidatedMap.get(key);
        consolidatedMap.set(key, {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
        });
      } else {
        consolidatedMap.set(key, {
          ...item,
          itemId: item.itemId || item._id,
          id: item.id || item._id,
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

  async function handleOrderPlacement() {
    if (isLoading) {
      toast.info("Please wait while we process your request...");
      return;
    }

    try {
      console.log("Current cart state:", cart);

      const invalidItems = cart.filter((item) => {
        const isInvalid = !item.id && !item.itemId;
        if (isInvalid) {
          console.warn("Invalid item found:", item);
        }
        return isInvalid;
      });

      if (invalidItems.length > 0) {
        console.error("Invalid items found:", invalidItems);
        throw new Error(
          `Found ${invalidItems.length} invalid items in cart. Each item must have an id or itemId.`
        );
      }

      const currentSessionId = sessionId || (await getOrCreateSession());

      if (!currentSessionId) {
        throw new Error("Unable to create session");
      }

      const orderResponse = await createOrUpdateOrder(currentSessionId, cart);

      // Fetch the latest ordered items after placing the order
      await fetchOrderedItems();

      setCart([]);

      setOrderPlacementDialog({
        isOpen: true,
        title: sessionId ? "Added to your Order" : "Order Placed",
        message: sessionId
          ? "We Updated the kitchen to prepare your additional items."
          : "Your order placed! The kitchen will start preparing your items.",
      });

      toast.success(orderResponse.message || "Order processed successfully!");
    } catch (error) {
      console.error("Order placement error:", error);
      const errorMessage = error.message.includes("invalid items")
        ? "Some items in your cart are missing required information. Please try adding them again."
        : "Error placing order. Please try again.";
      handleApiError(error, errorMessage);
    }
  }

  const inspectCartItems = () => {
    console.log("Cart inspection results:");
    cart.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        name: item.name,
        id: item.id,
        itemId: item.itemId,
        cartId: item.cartId,
        quantity: item.quantity,
        customizations: item.customizations,
      });
    });
  };

  useEffect(() => {
    if (cart.length > 0) {
      console.log("Cart updated:", cart);
      inspectCartItems();
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

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div
      className={`fixed inset-0 bg-white md:inset-y-0 md:right-0 md:w-96 transform transition-transform duration-300 ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      <div className="flex flex-col h-full">
        {/* Cart Header */}
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

        {/* Cart Items */}
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

        {/* Cart Summary */}
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

      {/* Dialogs */}
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
