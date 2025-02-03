import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { selectedItemState } from "./store/atoms";

const AddToCartModal = ({ addToCart }) => {
  const [selectedItem, setSelectedItem] = useRecoilState(selectedItemState);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState({});

  // Reset state when modal opens with new item
  useEffect(() => {
    setQuantity(1);
    setCustomizations({});
  }, [selectedItem]);

  const handleClose = () => setSelectedItem(null);

  const handleAdd = () => {
    addToCart(selectedItem, customizations, quantity);
    handleClose();
  };

  if (!selectedItem) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[#333333] font-semibold text-lg mb-4">
          {selectedItem.name}
        </h3>

        {/* Customization Options */}
        {selectedItem.customization &&
          Object.entries(selectedItem.customization).map(([key, options]) => (
            <div key={key} className="mb-4">
              <label className="block text-[#333333] mb-2 capitalize">
                {key}
              </label>
              <select
                className="w-full p-2 border border-[#E0E0E0] rounded-lg"
                onChange={(e) =>
                  setCustomizations((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
                value={customizations[key] || ""}
              >
                <option value="">Select {key}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-[#333333] mb-2">Quantity</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8 flex items-center justify-center bg-[#F4F1DE] rounded-full"
            >
              -
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-8 h-8 flex items-center justify-center bg-[#F4F1DE] rounded-full"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-[#333333] hover:bg-[#F4F1DE] rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#36A89A]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
