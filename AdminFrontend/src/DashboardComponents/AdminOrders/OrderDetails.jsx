import React, { useState, useMemo, useRef, useEffect } from "react";
import Button from "./Button";
import SpiceLevelDropdown from "./SpiceLevelDropdown";
import { X, Plus, Printer, Search } from "lucide-react";

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
  availableMenuItems,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);
  const orderDetailsRef = useRef(null);
  const isPaid = expandedOrder?.paymentStatus === "Paid";

  // Filter menu items based on search term
  const filteredMenuItems = useMemo(() => {
    if (!availableMenuItems) return [];
    return availableMenuItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableMenuItems, searchTerm]);

  // Handle adding an item from the menu list
  const handleMenuItemAdd = (menuItem) => {
    const newItem = {
      id: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      spiceLevel: "Medium",
    };

    const updatedItems = [...expandedOrder.items, newItem];
    setExpandedOrder({
      ...expandedOrder,
      items: updatedItems,
    });
  };

  // Keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + K shortcut for search
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  if (!expandedOrder) return null;

  const subtotal = calculateSubtotal(expandedOrder.items);
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleModalClick}
    >
      <div
        className="bg-white p-8 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex"
        ref={printRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* New Menu Search Section */}
        {!isPaid && (
          <div className="w-1/3 pr-4 border-r flex flex-col">
            <div className="relative mb-4">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search menu items (Ctrl + K)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-md pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="overflow-y-auto flex-grow">
              {filteredMenuItems.map((menuItem) => (
                <div
                  key={menuItem.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleMenuItemAdd(menuItem)}
                >
                  <div>
                    <span className="font-medium">{menuItem.name}</span>
                    <span className="text-gray-500 ml-2">
                      ₹{menuItem.price.toFixed(2)}
                    </span>
                  </div>
                  <Plus className="text-green-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Order Details Section */}
        <div 
          ref={orderDetailsRef}
          className={`${!isPaid ? "w-2/3 pl-4" : "w-full"} flex flex-col overflow-hidden`}
        >
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {/* Restaurant Info */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">{restaurantInfo.name}</h2>
              <p className="text-gray-600">{restaurantInfo.address}</p>
              <p className="text-gray-600">{restaurantInfo.phone}</p>
            </div>

            {/* Order Info */}
            <div className="mb-6 space-y-3">
              <h3 className="text-lg font-semibold">
                Order #{expandedOrder.id}
              </h3>
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
                  <tr className="bg-gray-50 sticky top-0">
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
                              const updatedItems = expandedOrder.items.map(
                                (i) =>
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center space-x-3 mt-4 pt-4 border-t">
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
    </div>
  );
};

export default OrderDetails;