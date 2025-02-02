import React, { useState, useMemo, useRef } from "react";
import { X, Plus, Search } from "lucide-react";
import axios from "axios";

const CustomDialog = ({ isOpen, onClose, tableNumber }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Table Already Active
          </h3>
          <p className="mt-2 text-gray-600">
            Table {tableNumber} currently has an active order. Please choose a
            different table or wait until the current order is completed.
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Okay, understood
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateOrder = ({
  onClose,
  onCreateOrder,
  restaurantInfo,
  availableMenuItems,
  TAX_RATE,
}) => {
  const [orderType, setOrderType] = useState("Dine-In");
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTableError, setShowTableError] = useState(false);
  const searchInputRef = useRef(null);

  // Filter menu items based on search term
  const filteredMenuItems = useMemo(() => {
    if (!availableMenuItems) return [];
    return availableMenuItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableMenuItems, searchTerm]);

  // Check table status using the API endpoint
  const checkTableStatus = async (tableNum) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/admin/order/${tableNum}`,
        {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        }
      );

      if (response.data.success) {
        return !response.data.success; // Return true if table is available (not active)
      }
      return true; // If table not found, assume it's available
    } catch (error) {
      console.error("Error checking table status:", error);
      if (error.response?.status === 404) {
        return true; // Table not found, so it's available
      }
      throw error;
    }
  };

  // Generate a unique ID for new items
  const generateUniqueId = () => {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Handle adding an item from the menu list
  const handleMenuItemAdd = (menuItem) => {
    const newItem = {
      id: generateUniqueId(), // Generate a unique temporary ID
      itemId: menuItem._id, // Keep the original menu item ID
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      spiceLevel: "Medium",
    };
    setItems([...items, newItem]);
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * TAX_RATE;
  };

  // Handle create order
  const handleCreateOrder = async () => {
    if (orderType === "Dine-In" && !tableNumber) {
      alert("Please enter a table number");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check table status for dine-in orders
      if (orderType === "Dine-In") {
        const isTableAvailable = await checkTableStatus(tableNumber);
        if (!isTableAvailable) {
          setShowTableError(true);
          setIsSubmitting(false);
          return;
        }
      }

      const response = await axios.post(
        "http://localhost:3000/api/v1/admin/orders",
        {
          type: orderType,
          tableNumber: orderType === "Dine-In" ? tableNumber : null,
          customerName: customerName || "Valued Customer",
          items: items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            spiceLevel: item.spiceLevel,
          })),
        },
        {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        }
      );

      if (response.data.order) {
        onCreateOrder(response.data.order);
        onClose();
      }
    } catch (error) {
      console.error("Error creating order:", error);
      if (error.response?.status === 404) {
        alert("Table not found. Please check the table number.");
      } else {
        alert(error.response?.data?.error || "Failed to create order");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle item deletion - Fixed to use correct ID
  const handleDeleteItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  // Handle quantity change - Fixed to use correct ID
  const handleQuantityChange = (itemId, newQuantity) => {
    setItems(
      items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: parseInt(newQuantity) || 1 }
          : item
      )
    );
  };

  // Handle spice level change - Fixed to use correct ID
  const handleSpiceLevelChange = (itemId, newLevel) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, spiceLevel: newLevel } : item
      )
    );
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleModalClick}
    >
      <div
        className="bg-white p-8 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Menu Search Section */}
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

        {/* Order Details Section */}
        <div className="w-2/3 pl-4 flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto pr-2">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">{restaurantInfo.name}</h2>
              <p className="text-gray-600">{restaurantInfo.address}</p>
              <p className="text-gray-600">{restaurantInfo.phone}</p>
            </div>

            {/* Order Type Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-4 bg-gray-100 p-2 rounded-lg">
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    orderType === "Dine-In"
                      ? "bg-blue-500 text-white font-medium shadow-sm"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setOrderType("Dine-In")}
                >
                  Dine-In
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    orderType === "Parcel"
                      ? "bg-blue-500 text-white font-medium shadow-sm"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setOrderType("Parcel")}
                >
                  Parcel
                </button>
              </div>
            </div>

            {/* Table Number & Customer Name */}
            <div className="mb-6 space-y-3">
              {orderType === "Dine-In" && ( // Changed from "Dine-in"
                <div className="flex items-center space-x-2">
                  <span>Table Number:</span>
                  <input
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="px-2 py-1 border rounded w-20"
                    placeholder="Table #"
                    min="1"
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span>Customer:</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-2 py-1 border rounded flex-grow"
                  placeholder="Customer name"
                />
              </div>
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
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">
                        <select
                          value={item.spiceLevel}
                          onChange={(e) =>
                            handleSpiceLevelChange(item.id, e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded"
                        >
                          <option value="Mild">Mild</option>
                          <option value="Medium">Medium</option>
                          <option value="Spicy">Spicy</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          className="w-20 px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">₹{item.price.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateOrder}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
      {/* Custom Dialog for table error */}
      <CustomDialog
        isOpen={showTableError}
        onClose={() => setShowTableError(false)}
        tableNumber={tableNumber}
      />
    </div>
  );
};

export default CreateOrder;
