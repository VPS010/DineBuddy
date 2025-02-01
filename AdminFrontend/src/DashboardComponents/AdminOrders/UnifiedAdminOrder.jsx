import React, { useState, useRef, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Plus } from "lucide-react";
import Button from "./Button";
import OrderStats from "./OrderStats";
import OrderTable from "./OrderTable";
import OrderDetails from "./OrderDetails";
import CreateOrder from "./CreateOrders";

const UnifiedAdminOrder = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [showRevenue, setShowRevenue] = useState(true);
  const [timeFilter, setTimeFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("Unpaid");
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const printRef = useRef();
  const pollingIntervalRef = useRef(null);

  // Helper function to check if a date falls within the selected time range
  const isDateInRange = (date) => {
    const orderDate = new Date(date);
    const now = new Date();

    if (timeFilter === "today") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      return orderDate >= startOfDay && orderDate <= endOfDay;
    } else if (timeFilter === "yesterday") {
      const startOfYesterday = new Date(now);
      startOfYesterday.setDate(now.getDate() - 1);
      startOfYesterday.setHours(0, 0, 0, 0);
      const endOfYesterday = new Date(now);
      endOfYesterday.setDate(now.getDate() - 1);
      endOfYesterday.setHours(23, 59, 59, 999);
      return orderDate >= startOfYesterday && orderDate <= endOfYesterday;
    } else if (timeFilter === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return orderDate >= startOfWeek;
    } else if (timeFilter === "month") {
      const startOfMonth = new Date(now);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      return orderDate >= startOfMonth;
    }
    return true; // For "all" time filter
  };
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/admin/menu",
          {
            headers: {
              Authorization: localStorage.getItem("authorization"),
            },
          }
        );
        setMenuItems(response.data.menuItems);
        setError(null);
      } catch (err) {
        setError("Failed to fetch menu items");
        console.error("Error fetching menu items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Fetch restaurant details
  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/admin/restaurant",
        {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        }
      );

      const { restaurant } = response.data;
      setRestaurantInfo({
        name: restaurant.name,
        tax: restaurant.tax,
        address: restaurant.address,
        phone: restaurant.contact,
        email: restaurant.description,
        businessHours: restaurant.businessHours,
        memberSince: restaurant.memberSince,
      });
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      setError("Failed to load restaurant details");
    }
  };

  // Helper function to get current tax rate
  const getCurrentTaxRate = () => {
    return restaurantInfo?.tax ? parseFloat(restaurantInfo.tax) : 0;
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/admin/orders",
        {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        }
      );

      const formattedOrders = response.data.data.map((order) => ({
        id: order._id,
        tableNumber: order.tableNumber,
        status: order.status,
        amount: order.totalAmount,
        createdAt: new Date(order.createdAt),
        items: order.items.map((item) => ({
          id: item.itemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          status: item.status,
          spiceLevel: item.spiceLevel,

          image: item.image,
        })),
        customerName: order.customerName,
        paymentStatus: order.paymentStatus,
        type: order.type,
      }));

      setOrders(formattedOrders);
      // console.log(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    }
  };

  useEffect(() => {
    // Start polling orders every 10 seconds
    const startPolling = () => {
      pollingIntervalRef.current = setInterval(() => {
        fetchOrders();
      }, 3000);
    };

    // Start polling when component mounts
    startPolling();

    // Clean up polling interval when component unmounts
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchRestaurantDetails(), fetchOrders()]);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get orders filtered by date range
  const getDateFilteredOrders = () => {
    return orders.filter((order) => isDateInRange(order.createdAt));
  };

  // Get orders filtered by both date and payment status
  const getFilteredOrders = () => {
    const dateFiltered = getDateFilteredOrders();
    if (statusFilter === "all") {
      return dateFiltered;
    }
    return dateFiltered.filter((order) => order.paymentStatus === statusFilter);
  };

  // Refetch orders when status filter changes
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const calculateTotalWithTax = (order) => {
    const subtotal = calculateSubtotal(order.items);
    return subtotal + calculateTax(subtotal);
  };

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Modify calculateTax function to use the tax rate from restaurantInfo
  const calculateTax = (subtotal) => {
    const taxRate = getCurrentTaxRate();
    return subtotal * taxRate;
  };
  const handleCustomerNameChange = async (orderId, newName) => {
    try {
      // Get current order items
      const currentOrder = orders.find((order) => order.id === orderId);
      if (!currentOrder) {
        throw new Error("Order not found");
      }

      const response = await axios.patch(
        `http://localhost:3000/api/v1/admin/order/${orderId}`,
        {
          action: "bulkEdit",
          items: currentOrder.items.map((item) => ({
            itemId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            spiceLevel: item.spiceLevel,
            status: "Pending",
          })),
          customerName: newName,
        },
        {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, customerName: newName } : order
          )
        );

        if (expandedOrder?.id === orderId) {
          setExpandedOrder((prev) => ({ ...prev, customerName: newName }));
        }

        setHasChanges(true);
      }
    } catch (error) {
      console.error("Error updating customer name:", error);
      alert(
        "Failed to update customer name: " +
          (error.response?.data?.error || error.message)
      );
    }
  };
  const handleMarkAsCompleted = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/admin/order/complete/${orderId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "Closed" } : order
          )
        );

        if (expandedOrder?.id === orderId) {
          setExpandedOrder((prev) => ({
            ...prev,
            status: "Closed",
          }));
        }
        // Refresh orders to get updated data
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(
        "Failed to update order status: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleSpiceLevelChange = async (itemId, level) => {
    if (expandedOrder) {
      const updatedItems = expandedOrder.items.map((item) =>
        item.id === itemId ? { ...item, spiceLevel: level } : item
      );
      setExpandedOrder({ ...expandedOrder, items: updatedItems });
      setHasChanges(true);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    if (expandedOrder) {
      const parsedQuantity = parseInt(quantity) || 0;
      if (parsedQuantity < 0) {
        alert("Quantity cannot be negative");
        return;
      }

      const updatedItems = expandedOrder.items.map((item) =>
        item.id === itemId ? { ...item, quantity: parsedQuantity } : item
      );
      setExpandedOrder({ ...expandedOrder, items: updatedItems });
      setHasChanges(true);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (expandedOrder) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/api/v1/admin/order/${expandedOrder.id}`,
          {
            action: "removeItem",
            item: { itemId },
          },
          {
            headers: {
              Authorization: localStorage.getItem("authorization"),
            },
          }
        );

        if (response.data.success) {
          const updatedItems = expandedOrder.items.filter(
            (item) => item.id !== itemId
          );
          setExpandedOrder((prev) => ({ ...prev, items: updatedItems }));
          setHasChanges(true);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert(
          "Failed to delete item: " +
            (error.response?.data?.error || error.message)
        );
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      const subtotal = calculateSubtotal(expandedOrder.items);
      const total = subtotal + calculateTax(subtotal);

      // Preserve all existing fields for each item
      const formattedItems = expandedOrder.items.map((item) => ({
        itemId: item.id || item.itemId, // Handle both id and itemId
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        spiceLevel: item.spiceLevel,
        status: item.status || "Pending",
        image: item.image, // Preserve image field
        _id: item._id, // Preserve _id field if it exists
      }));

      const response = await axios.patch(
        `http://localhost:3000/api/v1/admin/order/${expandedOrder.id}`,
        {
          action: "bulkEdit",
          items: formattedItems,
          customerName: expandedOrder.customerName,
          totalAmount: total,
        },
        {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        }
      );

      if (response.data.success) {
        setHasChanges(false);
        await fetchOrders();
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert(
        "Failed to save changes: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  const handleCheckout = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/admin/order/pay/${orderId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  paymentStatus: "Paid",
                  status: "Closed",
                }
              : order
          )
        );

        if (expandedOrder?.id === orderId) {
          setExpandedOrder((prev) => ({
            ...prev,
            paymentStatus: "Paid",
            status: "Closed",
          }));
        }
        // Refresh orders to get updated data
        fetchOrders();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(
        "Failed to process payment: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/admin/order/${orderId}`,
        {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        }
      );

      if (response.status === 200) {
        // Remove the order from local state
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );

        // Close expanded order view if it's the deleted order
        if (expandedOrder?.id === orderId) {
          setExpandedOrder(null);
        }

        // Refresh orders to get updated data
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      // console.log(
      //   "Failed to delete order: " +
      //     (error.response?.data?.error || error.message)
      // );
    }
  };

  const handleAddOrderClick = () => {
    setShowCreateOrder(true);
  };

  const handleOrderCreated = (newOrder) => {
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    setShowCreateOrder(false);
    fetchOrders(); // Refresh the orders list
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

  const filteredOrders = getFilteredOrders().filter((order) => {
    // If there's no search term, return all orders
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    // Safely check each field with null coalescing
    return (
      (order?.id?.toString() || "").toLowerCase().includes(searchLower) ||
      (order?.tableNumber?.toString() || "")
        .toLowerCase()
        .includes(searchLower) ||
      (order?.customerName?.toString() || "")
        .toLowerCase()
        .includes(searchLower)
    );
  });

  const dateFilteredOrders = getDateFilteredOrders();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen top-0 mx-auto flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        </div>
      </header>

      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderStats
          orders={dateFilteredOrders}
          showRevenue={showRevenue}
          setShowRevenue={setShowRevenue}
          TAX_RATE={getCurrentTaxRate()} // Pass the tax rate function
        />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search orders..."
              className="p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Time Filter Dropdown */}
            <select
              className="p-2 border rounded bg-white"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Orders</option>
            </select>

            {/* Status Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "ghost"}
                onClick={() => setStatusFilter("all")}
                className={`px-6 py-1 ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "Unpaid" ? "default" : "ghost"}
                onClick={() => setStatusFilter("Unpaid")}
                className={`px-6 py-1 ${
                  statusFilter === "Unpaid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Unpaid
              </Button>
              <Button
                variant={statusFilter === "Paid" ? "default" : "ghost"}
                onClick={() => setStatusFilter("Paid")}
                className={`px-6 py-1 ${
                  statusFilter === "Paid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Paid
              </Button>
            </div>
          </div>
          <div className="flex justify-end items-center mr-0">
            {/*add order button*/}
            <Button
              variant="primary"
              onClick={handleAddOrderClick}
              className="bg-blue-600 ml-auto mr-4 flex hover:bg-blue-700 border shadow-md text-white"
            >
              <Plus /> Add Order
            </Button>
          </div>
        </div>

        <OrderTable
          filteredOrders={filteredOrders}
          calculateTotalWithTax={calculateTotalWithTax}
          handleMarkAsCompleted={handleMarkAsCompleted}
          handleCheckout={handleCheckout}
          setExpandedOrder={setExpandedOrder}
          handleDeleteOrder={handleDeleteOrder}
        />

        <div className="mt-6 flex gap-4">
          <Button
            variant="ghost"
            onClick={handleExportOrders}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Export Orders
          </Button>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {expandedOrder && restaurantInfo && (
          <OrderDetails
            expandedOrder={expandedOrder}
            setExpandedOrder={setExpandedOrder}
            handleCustomerNameChange={handleCustomerNameChange}
            handleSpiceLevelChange={handleSpiceLevelChange}
            handleQuantityChange={handleQuantityChange}
            handleDeleteItem={handleDeleteItem}
            handleSaveChanges={handleSaveChanges}
            handlePrint={handlePrint}
            hasChanges={hasChanges}
            restaurantInfo={restaurantInfo}
            calculateSubtotal={calculateSubtotal}
            calculateTax={calculateTax}
            TAX_RATE={getCurrentTaxRate()} // Pass the tax rate function
            printRef={printRef}
            availableMenuItems={menuItems}
          />
        )}
        {showCreateOrder && (
          <CreateOrder
            onClose={() => setShowCreateOrder(false)}
            onCreateOrder={handleOrderCreated}
            restaurantInfo={restaurantInfo}
            availableMenuItems={menuItems}
            TAX_RATE={getCurrentTaxRate()}
          />
        )}
      </main>
    </div>
  );
};

export default UnifiedAdminOrder;
