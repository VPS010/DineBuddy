import React, { useState, useRef } from "react";
import { Printer, X, Plus, ChevronDown, Eye, EyeOff } from "lucide-react";

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

const UnifiedAdminOrder = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      tableNumber: "T1",
      status: "pending",
      amount: 150.0,
      createdAt: new Date(),
      items: [
        { id: 1, name: "Burger", quantity: 2, price: 25, spiceLevel: "Medium" },
        { id: 2, name: "Fries", quantity: 1, price: 5, spiceLevel: "Mild" },
      ],
      customerName: "Valued Customer",
      paymentStatus: "Unpaid",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hasChanges, setHasChanges] = useState(false);
  const [nextItemId, setNextItemId] = useState(3);
  const [showRevenue, setShowRevenue] = useState(false);
  const printRef = useRef();

  const TAX_RATE = 0.18;

  const restaurantInfo = {
    name: "Gourmet Restaurant",
    address: "123 Food Street, Cuisine City, FC 12345",
    phone: "+1 (555) 123-4567",
    email: "contact@gourmetrestaurant.com",
  };

  const orderStats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
    completedOrders: orders.filter((o) => o.status === "completed").length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
  };

  const calculateTotalWithTax = (order) => {
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * TAX_RATE;
    return subtotal + tax;
  };

  const handleCustomerNameChange = (newName) => {
    if (expandedOrder) {
      setExpandedOrder({ ...expandedOrder, customerName: newName });
      setHasChanges(true);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (expandedOrder) {
      const updatedItems = expandedOrder.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: parseInt(newQuantity) || 0 }
          : item
      );
      updateExpandedOrderWithTotal(updatedItems);
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

  React.useEffect(() => {
    const updatedOrders = orders.map((order) => ({
      ...order,
      amount: calculateTotalWithTax(order),
    }));
    setOrders(updatedOrders);
  }, []);

  const updateExpandedOrderWithTotal = (updatedItems) => {
    const newTotal = calculateTotalWithTax({ items: updatedItems });
    setExpandedOrder({
      ...expandedOrder,
      items: updatedItems,
      amount: newTotal,
    });
    setHasChanges(true);
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
    const updatedItems = [...expandedOrder.items, newItem];
    updateExpandedOrderWithTotal(updatedItems);
  };

  const handleDeleteItem = (itemId) => {
    if (expandedOrder) {
      const updatedItems = expandedOrder.items.filter(
        (item) => item.id !== itemId
      );
      updateExpandedOrderWithTotal(updatedItems);
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

  // Update handleSaveChanges to recalculate amount with tax
  const handleSaveChanges = () => {
    const updatedOrder = {
      ...expandedOrder,
      amount: calculateTotalWithTax(expandedOrder),
    };

    setOrders(
      orders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    setHasChanges(false);
    alert("Changes saved successfully!");
  };

  const handleMarkAsCompleted = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "completed" } : order
      )
    );
    if (expandedOrder?.id === orderId) {
      setExpandedOrder({ ...expandedOrder, status: "completed" });
    }
  };

  const handleCheckout = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, paymentStatus: "Paid" } : order
      )
    );
    if (expandedOrder?.id === orderId) {
      setExpandedOrder({ ...expandedOrder, paymentStatus: "Paid" });
    }
  };

  const handleExportOrders = () => {
    const headers = [
      "Order ID",
      "Table",
      "Customer",
      "Status",
      "Amount",
      "Created At",
    ];
    const csvData = [
      headers.join(","),
      ...orders.map((order) =>
        [
          order.id,
          order.tableNumber,
          order.customerName,
          order.status,
          order.amount.toFixed(2),
          new Date(order.createdAt).toLocaleString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "orders.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderExpandedOrder = () => {
    if (!expandedOrder) return null;

    const subtotal = calculateSubtotal(expandedOrder.items);
    const tax = calculateTax(subtotal);
    const total = subtotal + tax;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={() => setExpandedOrder(null)} // Close when clicking the overlay
      >
        <div
          className="bg-white p-8 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          ref={printRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">{restaurantInfo.name}</h2>
            <p className="text-gray-600">{restaurantInfo.address}</p>
            <p className="text-gray-600">{restaurantInfo.phone}</p>
          </div>

          <div className="mb-6 space-y-3">
            <h3 className="text-lg font-semibold">Order #{expandedOrder.id}</h3>
            <p>Table: {expandedOrder.tableNumber}</p>
            <div className="flex items-center space-x-2">
              <span>Customer:</span>
              <input
                type="text"
                value={expandedOrder.customerName}
                onChange={(e) => handleCustomerNameChange(e.target.value)}
                className="px-2 py-1 border rounded"
                placeholder="Customer name"
              />
            </div>
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
                          setHasChanges(true);
                        }}
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
                        onChange={(e) => {
                          const updatedItems = expandedOrder.items.map((i) =>
                            i.id === item.id
                              ? { ...i, price: parseFloat(e.target.value) || 0 }
                              : i
                          );
                          setExpandedOrder({
                            ...expandedOrder,
                            items: updatedItems,
                          });
                          setHasChanges(true);
                        }}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
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

          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleAddItem}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </div>

          <div className="flex flex-col items-end space-y-2 mb-8">
            <p className="text-lg">Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p className="text-lg">
              Tax ({(TAX_RATE * 100).toFixed(0)}%): ₹{tax.toFixed(2)}
            </p>
            <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => setExpandedOrder(null)}>
              Close
            </Button>
            <div className="flex space-x-3">
              {hasChanges && (
                <Button variant="success" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              )}
              <Button
                variant="success"
                onClick={() => handleMarkAsCompleted(expandedOrder.id)}
              >
                Mark as Completed
              </Button>
              <Button
                variant="primary"
                onClick={() => handleCheckout(expandedOrder.id)}
              >
                Checkout
              </Button>
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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        </div>
      </header>

      {/* Previous code remains the same until the main section */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Total Orders</h3>
            <p className="text-2xl">{orderStats.totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold flex items-center justify-between">
              Total Revenue
              <button
                onClick={() => setShowRevenue(!showRevenue)}
                className="text-gray-600 hover:text-gray-800"
              >
                {showRevenue ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </h3>
            <p className="text-2xl">
              {showRevenue
                ? `₹${new Intl.NumberFormat("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(orderStats.totalRevenue)}`
                : "₹****"}
            </p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Completed Orders</h3>
            <p className="text-2xl">{orderStats.completedOrders}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Pending Orders</h3>
            <p className="text-2xl">{orderStats.pendingOrders}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search orders..."
            className="p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (Inc. Tax)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setExpandedOrder(order)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.tableNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{calculateTotalWithTax(order).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsCompleted(order.id);
                          }}
                          className="text-sm"
                        >
                          Complete
                        </Button>
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckout(order.id);
                          }}
                          className="text-sm"
                        >
                          Checkout
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            variant="ghost"
            onClick={handleExportOrders}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Export Orders
          </Button>
        </div>
      </main>

      {renderExpandedOrder()}
    </div>
  );
};

export default UnifiedAdminOrder;
