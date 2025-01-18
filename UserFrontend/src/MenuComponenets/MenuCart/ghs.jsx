// Cart.js (Main Component)
import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { cartState, isCartOpenState } from "../store/atoms";
import { X } from "lucide-react";
import { CartItem } from "./CartItem";
import { OrderedItem } from "./OrderedItem";
import { CartSummary } from "./CartSummary";
import { ConfirmationDialog } from "./ConfirmationDialog";

const Cart = ({
  updateCartItemQuantity: externalUpdateCartItemQuantity,
  removeFromCart,
  tableNumber,
}) => {
  const [cart, setCart] = useRecoilState(cartState);
  const [isCartOpen, setIsCartOpen] = useRecoilState(isCartOpenState);
  const [orderedItems, setOrderedItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Function to check if two items are identical
  const areItemsIdentical = (item1, item2) => {
    return (
      item1.name === item2.name &&
      JSON.stringify(item1.customizations) ===
        JSON.stringify(item2.customizations)
    );
  };

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

  const showRemoveDialog = (cartId) => {
    setItemToRemove(cartId);
    setDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    removeFromCart(itemToRemove);
    setDialogOpen(false);
    setItemToRemove(null);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error("Cannot place an empty order.");
      return;
    }
    setOrderDialogOpen(true);
  };

  const confirmOrderPlacement = () => {
    const updatedOrderedItems = consolidateCart([...orderedItems, ...cart]);
    console.log("New Ordered Items", cart);
    setOrderedItems(updatedOrderedItems);
    console.log("All Ordered Items", updatedOrderedItems);
    setCart([]);
    toast.success("Order placed successfully!");
    setOrderDialogOpen(false);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full md:w-96 bg-[#FFFFFF] shadow-xl transform transition-transform ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-[#E8E1D3] flex justify-between items-center bg-[#F9F6F0]">
          <h2 className="text-[#2D3436] font-semibold text-lg">Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#2D3436] hover:bg-[#E8E1D3] rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <h3 className="p-4 text-lg font-semibold text-[#2D3436]">
            New Items
          </h3>
          {cart.length > 0 ? (
            cart.map((item) => (
              <CartItem
                key={item.cartId}
                item={item}
                updateCartItemQuantity={updateCartItemQuantity}
                showRemoveDialog={showRemoveDialog}
              />
            ))
          ) : (
            <p className="p-4 text-[#666666] text-center">
              Your cart is empty.
            </p>
          )}

          <h3 className="p-4 text-lg font-semibold text-[#2D3436]">
            Ordered Items
          </h3>
          {orderedItems.length > 0 ? (
            orderedItems.map((item) => (
              <OrderedItem key={item.cartId} item={item} />
            ))
          ) : (
            <p className="p-4 text-[#666666] text-center">
              No items ordered yet.
            </p>
          )}
        </div>

        <CartSummary
          subtotal={subtotal}
          tax={tax}
          total={total}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>

      <ConfirmationDialog
        isOpen={dialogOpen}
        title="Remove Item"
        message="Are you sure you want to remove this item from the cart?"
        onConfirm={handleConfirmRemove}
        onCancel={() => setDialogOpen(false)}
        confirmText="Remove"
        confirmButtonClass="bg-[#9E2A2F]"
      />

      <ConfirmationDialog
        isOpen={orderDialogOpen}
        title="Confirm Order"
        message="Are you sure you want to place this order?"
        onConfirm={confirmOrderPlacement}
        onCancel={() => setOrderDialogOpen(false)}
        confirmText="Confirm"
        confirmButtonClass="bg-[#2D6A4F]"
      />
    </div>
  );
};

export default Cart;
