import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { cartState, isCartOpenState } from "../store/atoms";
import { X } from "lucide-react";
import { CartItem } from "./CartItem";
import { OrderedItem } from "./OrderedItem";
import { CartSummary } from "./CartSummary";
import { ConfirmationDialog } from "./ConfirmationDialog";
import LocationVerification from "./LocationVerification";

const Cart = ({
  updateCartItemQuantity: externalUpdateCartItemQuantity,
  removeFromCart,
  tableNumber,
}) => {
  const [cart, setCart] = useRecoilState(cartState);
  const [isCartOpen, setIsCartOpen] = useRecoilState(isCartOpenState);
  const [orderedItems, setOrderedItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Initialize LocationVerification hook
  const locationVerification = LocationVerification({
    onLocationVerified: () => {
      const updatedOrderedItems = consolidateCart([...orderedItems, ...cart]);
      setOrderedItems(updatedOrderedItems);
      setCart([]);
      toast.success("Order placed successfully!");
    },
    onLocationDenied: () => {
      toast.info("Order cancelled due to location verification.");
    },
  });

  // Function to consolidate cart items
  const consolidateCart = (items) => {
    const consolidatedMap = new Map();

    items.forEach((item) => {
      const key = `${item.name}-${JSON.stringify(item.customizations)}`;
      if (consolidatedMap.has(key)) {
        const existingItem = consolidatedMap.get(key);
        existingItem.quantity += item.quantity;
      } else {
        consolidatedMap.set(key, { ...item });
      }
    });

    return Array.from(consolidatedMap.values());
  };

  useEffect(() => {
    const consolidated = consolidateCart(cart);
    if (JSON.stringify(consolidated) !== JSON.stringify(cart)) {
      setCart(consolidated);
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
                <OrderedItem key={item.cartId} item={item} />
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

      {locationVerification.dialog}
    </div>
  );
};

export default Cart;
