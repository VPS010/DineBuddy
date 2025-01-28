export const CartSummary = ({ onPlaceOrder }) => (
  <div className="p-4 border-t border-[#E8E1D3] bg-[#F9F6F0]">
    <button
      onClick={onPlaceOrder}
      className="w-full bg-[#2D6A4F] text-white py-3 mt-4 rounded-lg text-sm md:text-base"
    >
      Place Order
    </button>
  </div>
);
