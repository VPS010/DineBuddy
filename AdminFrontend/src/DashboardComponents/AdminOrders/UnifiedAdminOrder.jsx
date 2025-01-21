import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import OrderStats from "./OrderStats";
import OrderTable from "./OrderTable";
import OrderDetails from "./OrderDetails";

const UnifiedAdminOrder = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hasChanges, setHasChanges] = useState(false);
  const [showRevenue, setShowRevenue] = useState(true);
  const printRef = useRef();

  const TAX_RATE = 0.18;

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

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const params = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await axios.get(
        "http://localhost:3000/api/v1/admin/orders",
        {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
          params,
        }
      );

      const formattedOrders = response.data.data.map((order) => ({
        id: order._id,
        tableNumber: order.tableNumber,
        status: order.status, // Remove toLowerCase()
        amount: order.totalAmount,
        createdAt: new Date(order.createdAt),
        items: order.items.map((item) => ({
          id: item.itemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          spiceLevel: item.spiceLevel,
        })),
        customerName: order.customerName,
        paymentStatus: order.paymentStatus,
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    }
  };

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

  const calculateTax = (subtotal) => {
    return subtotal * TAX_RATE;
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

  const handleAddItem = async () => {
    if (expandedOrder) {
      const newItem = {
        id: Date.now().toString(),
        name: "",
        quantity: 1,
        price: 0,
        spiceLevel: "Medium",
      };

      try {
        const response = await axios.patch(
          `http://localhost:3000/api/v1/admin/order/${expandedOrder.id}`,
          {
            action: "addItem",
            item: {
              itemId: newItem.id,
              name: newItem.name,
              quantity: newItem.quantity,
              price: newItem.price,
              spiceLevel: newItem.spiceLevel,
            },
          },
          {
            headers: {
              Authorization: localStorage.getItem("authorization"),
            },
          }
        );

        if (response.data.success) {
          setExpandedOrder((prev) => ({
            ...prev,
            items: [...prev.items, newItem],
          }));
          setHasChanges(true);
        }
      } catch (error) {
        console.error("Error adding item:", error);
        alert(
          "Failed to add item: " +
            (error.response?.data?.error || error.message)
        );
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      const subtotal = calculateSubtotal(expandedOrder.items);
      const total = subtotal + calculateTax(subtotal);

      const formattedItems = expandedOrder.items.map((item) => ({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        spiceLevel: item.spiceLevel,
        status: "Pending", // Preserve item status
      }));

      const response = await axios.patch(
        `http://localhost:3000/api/v1/admin/order/${expandedOrder.id}`,
        {
          action: "bulkEdit",
          items: formattedItems,
          totalAmount: total, // Include total amount
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
      alert(
        "Failed to delete order: " +
          (error.response?.data?.error || error.message)
      );
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
      <header className="bg-white shadow-sm ">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        </div>
      </header>

      <main className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderStats
          orders={orders}
          showRevenue={showRevenue}
          setShowRevenue={setShowRevenue}
          TAX_RATE={TAX_RATE}
        />

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
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
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

        {expandedOrder && restaurantInfo && (
          <OrderDetails
            expandedOrder={expandedOrder}
            setExpandedOrder={setExpandedOrder}
            handleCustomerNameChange={handleCustomerNameChange}
            handleSpiceLevelChange={handleSpiceLevelChange}
            handleQuantityChange={handleQuantityChange}
            handleDeleteItem={handleDeleteItem}
            handleAddItem={handleAddItem}
            handleSaveChanges={handleSaveChanges}
            handlePrint={handlePrint}
            hasChanges={hasChanges}
            restaurantInfo={restaurantInfo}
            calculateSubtotal={calculateSubtotal}
            calculateTax={calculateTax}
            TAX_RATE={TAX_RATE}
            printRef={printRef}
          />
        )}
      </main>
    </div>
  );
};
export default UnifiedAdminOrder;
