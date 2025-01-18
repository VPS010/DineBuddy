export const CartSummary = ({ subtotal, tax, total, onPlaceOrder }) => (
    <div className="p-4 border-t border-[#E8E1D3] bg-[#F9F6F0]">
      <div className="flex justify-between mb-2">
        <span className="text-[#2D3436] font-semibold text-sm">Subtotal</span>
        <span className="text-[#2D3436] text-sm">₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-[#2D3436] font-semibold text-sm">Tax (10%)</span>
        <span className="text-[#2D3436] text-sm">₹{tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#2D3436] font-semibold text-base">Total</span>
        <span className="text-[#2D3436] text-base">₹{total.toFixed(2)}</span>
      </div>
      <button
        onClick={onPlaceOrder}
        className="w-full bg-[#2D6A4F] text-white py-3 mt-4 rounded-lg text-sm md:text-base"
      >
        Place Order
      </button>
    </div>
  );
  