import React from 'react';

const CartItem = ({ item, updateCartItemQuantity, removeFromCart }) => (
  <div className="flex items-center gap-4 p-4 border-b border-[#E0E0E0]">
    <img
      src={item.image}
      alt={item.name}
      className="w-20 h-20 object-cover rounded-lg"
    />
    <div className="flex-1">
      <h4 className="text-[#333333] font-semibold">{item.name}</h4>
      {item.customizations && Object.entries(item.customizations).map(([key, value]) => (
        <p key={key} className="text-sm text-[#A5A5A5]">
          {key}: {value}
        </p>
      ))}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateCartItemQuantity(item.cartId, item.quantity - 1)}
            className="w-8 h-8 flex items-center justify-center bg-[#F4F1DE] rounded-full hover:bg-[#E0E0E0]"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => updateCartItemQuantity(item.cartId, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center bg-[#F4F1DE] rounded-full hover:bg-[#E0E0E0]"
          >
            +
          </button>
        </div>
        <span className="text-[#2D6A4F] font-semibold">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
    <button
      onClick={() => removeFromCart(item.cartId)}
      className="text-[#9E2A2F] hover:text-[#E63946]"
    >
      Remove
    </button>
  </div>
);

const Cart = ({ isCartOpen, setIsCartOpen, cart, updateCartItemQuantity, removeFromCart }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg transform transition-transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-[#E0E0E0] flex justify-between items-center">
          <h2 className="text-[#333333] font-semibold text-lg">Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-[#333333] hover:text-[#9E2A2F]"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="p-4 text-center text-[#A5A5A5]">
              Your cart is empty
            </div>
          ) : (
            cart.map(item => (
              <CartItem 
                key={item.cartId} 
                item={item}
                updateCartItemQuantity={updateCartItemQuantity}
                removeFromCart={removeFromCart}
              />
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-[#E0E0E0]">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-[#A5A5A5]">Subtotal</span>
                <span className="text-[#333333]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#A5A5A5]">Tax</span>
                <span className="text-[#333333]">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-[#2D6A4F]">${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="w-full py-3 bg-[#9E2A2F] text-white rounded-lg hover:bg-[#E63946] transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;