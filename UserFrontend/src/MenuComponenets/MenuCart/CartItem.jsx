import React from 'react';
import { X } from "lucide-react";

export const CartItem = ({ item, updateCartItemQuantity, showRemoveDialog }) => (
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
