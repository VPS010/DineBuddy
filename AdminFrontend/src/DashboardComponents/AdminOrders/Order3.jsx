import React, { useState, useRef } from "react";
import { Printer, X, Plus, ChevronDown } from "lucide-react";

const Button = ({ children, variant = "primary", onClick, className = "" }) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const SpiceLevelDropdown = ({ value, onChange }) => {
  const levels = ["Mild", "Medium", "Spicy"];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value} <ChevronDown className="w-4 h-4 ml-2" />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {levels.map((level) => (
            <div
              key={level}
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(level);
                setIsOpen(false);
              }}
            >
              {level}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminOrder3 = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders] = useState( 
    [
    {
      id: 1,
      tableNumber: "T1",
      status: "active",
      amount: 150.0,
      createdAt: new Date(),
      items: [
        {
          id: 1,
          name: "Burger",
          quantity: 2,
          price: 25,
          spiceLevel: "Medium",
        },
        {
          id: 2,
          name: "Fries",
          quantity: 1,
          price: 5,
          spiceLevel: "Mild",
        },
      ],
    },
  ]);

  const [hasChanges, setHasChanges] = useState(false);
  const printRef = useRef();
  const [nextItemId, setNextItemId] = useState(3);

  const TAX_RATE = 0.08;

  const restaurantInfo = {
    name: "Gourmet Restaurant",
    address: "123 Food Street, Cuisine City, FC 12345",
    phone: "+1 (555) 123-4567",
    email: "contact@gourmetrestaurant.com",
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (expandedOrder) {
      const updatedItems = expandedOrder.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: parseInt(newQuantity) || 0 }
          : item
      );
      setExpandedOrder({ ...expandedOrder, items: updatedItems });
      setHasChanges(true);
    }
  };

  const handleSpiceLevelChange = (itemId, newLevel) => {
    if (expandedOrder) {
      const updatedItems = expandedOrder.items.map((item) =>
        item.id === itemId ? { ...item, spiceLevel: newLevel } : item
      );
      setExpandedOrder({ ...expandedOrder, items: updatedItems });
      setHasChanges(true);
    }
  };

  const handleDeleteItem = (itemId) => {
    if (expandedOrder) {
      const updatedItems = expandedOrder.items.filter(
        (item) => item.id !== itemId
      );
      setExpandedOrder({ ...expandedOrder, items: updatedItems });
      setHasChanges(true);
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: nextItemId,
      name: "",
      quantity: 1,
      price: 0,
      spiceLevel: "Mild",
    };

    setNextItemId(nextItemId + 1);
    setExpandedOrder({
      ...expandedOrder,
      items: [...expandedOrder.items, newItem],
    });
    setHasChanges(true);
  };

  const handleItemNameChange = (itemId, newName) => {
    if (expandedOrder) {
      const updatedItems = expandedOrder.items.map((item) =>
        item.id === itemId ? { ...item, name: newName } : item
      );
      setExpandedOrder({ ...expandedOrder, items: updatedItems });
      setHasChanges(true);
    }
  };

  const handlePriceChange = (itemId, newPrice) => {
    if (expandedOrder) {
      const updatedItems = expandedOrder.items.map((item) =>
        item.id === itemId
          ? { ...item, price: parseFloat(newPrice) || 0 }
          : item
      );
      setExpandedOrder({ ...expandedOrder, items: updatedItems });
      setHasChanges(true);
    }
  };

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * TAX_RATE;
  };

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  const handleSaveChanges = () => {
    setHasChanges(false);
    alert("Changes saved successfully!");
  };

  const renderExpandedOrder = () => {
    if (!expandedOrder) return null;

    const subtotal = calculateSubtotal(expandedOrder.items);
    const tax = calculateTax(subtotal);
    const total = subtotal + tax;

    return (
      <div className="fixed inset-0 bg-gray-100 overflow-auto">
        <div
          className="max-w-4xl mx-auto my-8 bg-white p-8 shadow-lg"
          ref={printRef}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">{restaurantInfo.name}</h2>
            <p className="text-gray-600">{restaurantInfo.address}</p>
            <p className="text-gray-600">{restaurantInfo.phone}</p>
            <p className="text-gray-600">{restaurantInfo.email}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold">Order #{expandedOrder.id}</h3>
            <p>Table: {expandedOrder.tableNumber}</p>
            <p>Date: {new Date(expandedOrder.createdAt).toLocaleString()}</p>
          </div>

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
                {expandedOrder.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleItemNameChange(item.id, e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Item name"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <SpiceLevelDropdown
                        value={item.spiceLevel}
                        onChange={(level) =>
                          handleSpiceLevelChange(item.id, level)
                        }
                      />
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
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          handlePriceChange(item.id, e.target.value)
                        }
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      ${(item.price * item.quantity).toFixed(2)}
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

          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleAddItem}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </div>

          <div className="flex flex-col items-end space-y-2 mb-6">
            <p className="text-lg">Subtotal: ${subtotal.toFixed(2)}</p>
            <p className="text-lg">
              Tax ({(TAX_RATE * 100).toFixed(0)}%): ${tax.toFixed(2)}
            </p>
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setExpandedOrder(null)}>
              Close
            </Button>
            <div className="space-x-4">
              {hasChanges && (
                <Button variant="success" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handlePrint}
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

  const columns = [
    { key: "id", label: "Order ID" },
    { key: "tableNumber", label: "Table" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const statusColors = {
          pending: "bg-yellow-100 text-yellow-800",
          active: "bg-blue-100 text-blue-800",
          completed: "bg-green-100 text-green-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[row.status]
            }`}
          >
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => `$${row.amount.toFixed(2)}`,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setExpandedOrder(order)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    {columns.map((column) => (
                      <td
                        key={`${order.id}-${column.key}`}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {column.render
                          ? column.render(order)
                          : order[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {renderExpandedOrder()}
    </div>
  );
};

export default AdminOrder3;
