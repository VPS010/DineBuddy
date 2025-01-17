import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { cartState, isCartOpenState } from "./store/atoms";
import { X } from "lucide-react";

const CartItem = ({
  item,
  updateCartItemQuantity,
  removeFromCart,
  showRemoveDialog,
}) => (
  <div className="flex items-center gap-3 p-3 border-b border-[#E8E1D3]">
    <img
      src={item.image}
      alt={item.name}
      className="w-16 h-16 object-cover rounded-md border border-[#E8E1D3]"
    />
    <div className="flex-1 min-w-0">
      <h4 className="text-[#2D3436] font-medium text-sm md:text-base truncate">
        {item.name}
      </h4>
      {item.customizations && (
        <div className="flex flex-wrap gap-2 mt-1">
          {Object.entries(item.customizations).map(([key, value]) => (
            <span
              key={key}
              className="text-xs text-[#666666] bg-[#F9F6F0] px-2 py-0.5 rounded-full"
            >
              {value}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center bg-[#F9F6F0] rounded-lg">
          <button
            onClick={() =>
              item.quantity === 1
                ? showRemoveDialog(item.cartId)
                : updateCartItemQuantity(item.cartId, item.quantity - 1)
            }
            className="w-7 h-7 flex items-center justify-center text-[#2D6A4F] hover:bg-[#E8E1D3] rounded-l-lg transition-colors"
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <button
            onClick={() =>
              updateCartItemQuantity(item.cartId, item.quantity + 1)
            }
            className="w-7 h-7 flex items-center justify-center text-[#2D6A4F] hover:bg-[#E8E1D3] rounded-r-lg transition-colors"
          >
            +
          </button>
        </div>
        <span className="text-[#2D6A4F] font-semibold text-sm md:text-base">
          ₹{(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
    <button
      onClick={() => showRemoveDialog(item.cartId)}
      className="p-1.5 text-[#9E2A2F] hover:bg-[#FDF2F3] rounded-full transition-colors"
      aria-label="Remove item"
    >
      <X size={18} />
    </button>
  </div>
);

const OrderedItem = ({ item }) => (
  <div className="flex items-center gap-3 p-4 my-2 border-b border-[#E8E1D3]">
    {/* Image Section */}
    <div className="flex-shrink-0">
      <img
        src={item.image}
        alt={item.name}
        className="w-14 h-14 object-cover rounded-md border border-[#E8E1D3]"
      />
    </div>

    {/* Content Section */}
    <div className="flex-1 flex items-center  justify-between">
      {/* Name and Customizations */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h4 className="text-[#2D3436] font-medium text-sm md:text-base truncate">
          {item.name}
        </h4>

        <div className="flex flex-wrap gap-1">
          {item.customizations &&
            Object.entries(item.customizations).map(([key, value]) => (
              <span
                key={key}
                className="text-xs text-[#666666] bg-[#F9F6F0] px-2 py-0.5 rounded-full"
              >
                {value}
              </span>
            ))}
        </div>
      </div>

      {/* Quantity and Price */}
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-[#F9F6F0] rounded-lg px-2 py-0.5">
          <span className="text-center text-sm font-medium">
            {item.quantity}
          </span>
        </div>
        <span className="text-[#2D6A4F] font-semibold text-sm md:text-base">
          ₹{(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

const Cart = ({ updateCartItemQuantity, removeFromCart, tableNumber }) => {
  const [cart, setCart] = useRecoilState(cartState);
  const [isCartOpen, setIsCartOpen] = useRecoilState(isCartOpenState);
  const [orderedItems, setOrderedItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const showRemoveDialog = (cartId) => {
    setItemToRemove(cartId);
    setDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    removeFromCart(itemToRemove);
    setDialogOpen(false);
    setItemToRemove(null);
  };

  const handleCancelRemove = () => {
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
    const updatedOrderedItems = cart.reduce(
      (acc, item) => {
        // Check if the item already exists (same name and customizations)
        const existingItem = acc.find(
          (i) =>
            i.name === item.name &&
            JSON.stringify(i.customizations) ===
              JSON.stringify(item.customizations)
        );

        if (existingItem) {
          // If the item exists, update the quantity
          existingItem.quantity += item.quantity;
        } else {
          // If the item does not exist, add a new item
          acc.push({ ...item });
        }

        return acc;
      },
      [...orderedItems]
    ); // Merge with previously ordered items

    setOrderedItems(updatedOrderedItems);
    setCart([]); // Clear the cart after placing the order
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
                removeFromCart={removeFromCart}
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

        <div className="p-4 border-t border-[#E8E1D3] bg-[#F9F6F0]">
          <div className="flex justify-between mb-2">
            <span className="text-[#2D3436] font-semibold text-sm">
              Subtotal
            </span>
            <span className="text-[#2D3436] text-sm">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-[#2D3436] font-semibold text-sm">
              Tax (10%)
            </span>
            <span className="text-[#2D3436] text-sm">₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#2D3436] font-semibold text-base">
              Total
            </span>
            <span className="text-[#2D3436] text-base">
              ₹{total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-[#2D6A4F] text-white py-3 mt-4 rounded-lg text-sm md:text-base"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Remove Item Dialog */}
      {dialogOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
          onClick={handleCancelRemove}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#2D3436]">
              Remove Item
            </h3>
            <p className="mt-2 text-sm text-[#666666]">
              Are you sure you want to remove this item from the cart?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCancelRemove}
                className="bg-[#E8E1D3] text-[#2D3436] py-1 px-4 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="bg-[#9E2A2F] text-white py-1 px-4 rounded-lg text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Dialog */}
      {orderDialogOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
          onClick={() => setOrderDialogOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#2D3436]">
              Confirm Order
            </h3>
            <p className="mt-2 text-sm text-[#666666]">
              Are you sure you want to place this order?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOrderDialogOpen(false)}
                className="bg-[#E8E1D3] text-[#2D3436] py-1 px-4 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrderPlacement}
                className="bg-[#2D6A4F] text-white py-1 px-4 rounded-lg text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
