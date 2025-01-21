import React, { useState } from "react";
import Button from "./Button";
import SpiceLevelDropdown from "./SpiceLevelDropdown";
import { X, Plus, Printer } from "lucide-react";

const OrderDetails = ({
  expandedOrder,
  setExpandedOrder,
  handleCustomerNameChange,
  handleSpiceLevelChange,
  handleQuantityChange,
  handleDeleteItem,
  handleAddItem,
  handleSaveChanges: onSaveChanges,
  handlePrint,
  hasChanges,
  restaurantInfo,
  calculateSubtotal,
  calculateTax,
  TAX_RATE,
  printRef,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const isPaid = expandedOrder?.paymentStatus === "Paid";

  if (!expandedOrder) return null;

  const subtotal = calculateSubtotal(expandedOrder.items);
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      await onSaveChanges(expandedOrder);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setExpandedOrder(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleModalClick}
    >
      <div
        className="bg-white p-8 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        ref={printRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Restaurant Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{restaurantInfo.name}</h2>
          <p className="text-gray-600">{restaurantInfo.address}</p>
          <p className="text-gray-600">{restaurantInfo.phone}</p>
        </div>

        {/* Order Info */}
        <div className="mb-6 space-y-3">
          <h3 className="text-lg font-semibold">Order #{expandedOrder.id}</h3>
          <p>Table: {expandedOrder.tableNumber}</p>
          <div className="flex items-center space-x-2">
            <span>Customer:</span>
            {isPaid ? (
              <span>{expandedOrder.customerName || "N/A"}</span>
            ) : (
              <input
                type="text"
                value={expandedOrder.customerName || ""}
                onChange={(e) =>
                  handleCustomerNameChange(expandedOrder.id, e.target.value)
                }
                className="px-2 py-1 border rounded"
                placeholder="Customer name"
                disabled={isSaving}
              />
            )}
          </div>
          <p>Date: {new Date(expandedOrder.createdAt).toLocaleString()}</p>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full mb-6">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Spice Level</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Subtotal</th>
                {!isPaid && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {expandedOrder.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">
                    {isPaid ? (
                      <span>{item.name}</span>
                    ) : (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const updatedItems = expandedOrder.items.map((i) =>
                            i.id === item.id
                              ? { ...i, name: e.target.value }
                              : i
                          );
                          setExpandedOrder({
                            ...expandedOrder,
                            items: updatedItems,
                          });
                        }}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Item name"
                        disabled={isSaving}
                      />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isPaid ? (
                      <span>{item.spiceLevel}</span>
                    ) : (
                      <SpiceLevelDropdown
                        value={item.spiceLevel}
                        onChange={(level) =>
                          handleSpiceLevelChange(item.id, level)
                        }
                        disabled={isSaving}
                      />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isPaid ? (
                      <span>{item.quantity}</span>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="w-20 px-2 py-1 border rounded"
                        disabled={isSaving}
                      />
                    )}
                  </td>
                  <td className="px-4 py-2">₹{item.price.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </td>
                  {!isPaid && (
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        disabled={isSaving}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Item Button */}
        {!isPaid && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleAddItem}
              disabled={isSaving}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </div>
        )}

        {/* Totals */}
        <div className="flex flex-col items-end space-y-2 mb-8">
          <p className="text-lg">Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p className="text-lg">
            Tax ({(TAX_RATE * 100).toFixed(0)}%): ₹{tax.toFixed(2)}
          </p>
          <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center space-x-3">
          <Button
            variant="ghost"
            onClick={() => setExpandedOrder(null)}
            disabled={isSaving}
          >
            Close
          </Button>
          {!isPaid && hasChanges && (
            <Button
              variant="success"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handlePrint}
            disabled={isSaving}
            className="flex items-center"
          >
            <Printer className="w-4 h-4 mr-2" /> Print Bill
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
