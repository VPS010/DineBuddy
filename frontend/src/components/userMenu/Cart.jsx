const Cart = ({ cart, setCart, isCartOpen, setIsCartOpen, updateCartItemQuantity, removeFromCart }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
  
    return (
      <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg transform transition-transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-[#E0E0E0] flex justify-between items-center">
            <h2>Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)}>Close</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              cart.map(item => (
                <div key={item.cartId}>
                  <p>{item.name}</p>
                  <button onClick={() => removeFromCart(item.cartId)}>Remove</button>
                </div>
              ))
            )}
          </div>
          <div>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax: ${tax.toFixed(2)}</p>
            <p>Total: ${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  };
  export default Cart;
  