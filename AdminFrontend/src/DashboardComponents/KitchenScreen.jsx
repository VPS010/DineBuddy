import React, { useState, useEffect } from "react";
import { Clock, RefreshCw, Package, FullscreenIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OrderCard from "../components/OrderCard";
import ShortlistedItem from "../components/ShortlistedItem";

const KitchenScreen = () => {
  const [orders, setOrders] = useState([]);
  const [shortlistedItems, setShortlistedItems] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async (isInitialFetch = false) => {
    try {
      if (isInitialFetch) {
        setInitialLoading(true);
      }

      const response = await axios.get(
        "http://localhost:3000/api/v1/admin/orders/kitchen",
        {
          headers: {
            authorization: localStorage.getItem("authorization"),
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
        setError(null);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch orders");
    } finally {
      if (isInitialFetch) {
        setInitialLoading(false);
      }
    }
  };

  // Effect for shortlisted items aggregation - Modified to only show In Progress items
  useEffect(() => {
    const itemMap = new Map();

    orders.forEach((order) => {
      if (order.status !== "Closed") {
        order.items.forEach((item) => {
          // Only include items with status "In Progress"
          if (item.status === "In Progress") {
            const key = `${item.name}-${item.spiceLevel}`;
            if (!itemMap.has(key)) {
              itemMap.set(key, {
                name: item.name,
                spiceLevel: item.spiceLevel,
                quantity: 0,
              });
            }
            itemMap.get(key).quantity += item.quantity;
          }
        });
      }
    });

    setShortlistedItems(Array.from(itemMap.values()));
  }, [orders]);

  // Initial fetch effect
  useEffect(() => {
    fetchOrders(true);
  }, []);

  // Polling effect
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchOrders(false);
    }, 2000);

    return () => clearInterval(pollInterval);
  }, []);

  // Clock update effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle individual item status updates
  const handleItemStatusUpdate = async (orderId, itemId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/admin/orders/${orderId}/${itemId}`,
        { status: newStatus },
        {
          headers: {
            authorization: localStorage.getItem("authorization"),
          },
        }
      );

      if (response.data.success) {
        setOrders(
          orders.map((order) => {
            if (order._id === orderId) {
              return {
                ...order,
                items: order.items.map((item) =>
                  item._id === itemId ? { ...item, status: newStatus } : item
                ),
              };
            }
            return order;
          })
        );
      }
    } catch (error) {
      console.error("Error updating item status:", error);
    }
  };

  const isOrderFullyCompleted = (order) => {
    return order.items.every((item) => item.status === "Completed");
  };

  const getFilteredOrders = () => {
    return orders
      .filter(
        (order) =>
          (activeFilter === "all" || order.type === activeFilter) &&
          order.status !== "Closed"
      )
      .sort((a, b) => {
        // First, separate fully completed orders
        const aCompleted = isOrderFullyCompleted(a);
        const bCompleted = isOrderFullyCompleted(b);

        if (aCompleted && !bCompleted) return 1;
        if (!aCompleted && bCompleted) return -1;

        // If both are completed or both are not completed,
        // sort by updatedAt time (most recent first)
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
  };

  const getCompletedOrders = () => {
    return orders
      .filter((order) => order.status === "Closed")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const toggleFullscreen = () => {
    navigate(
      location.pathname === "/admin/kitchen"
        ? "/admin/dashboard"
        : "/admin/kitchen"
    );
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">Error loading orders</p>
          <p>{error}</p>
          <button
            onClick={() => fetchOrders(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header remains the same */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Kitchen Screen</h1>
            <div className="bg-white flex items-center rounded-lg shadow-sm">
              <h3 className="font-semibold text-3xl">Total Active Orders:</h3>
              <p className="text-3xl mx-2 font-semibold">
                {getFilteredOrders().length}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock />
              <span className="text-3xl">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            <button onClick={toggleFullscreen} className="px-4">
              <FullscreenIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-12 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Shortlisted Items Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold mb-4 ml-3">
              In Progress Items
            </h2>
            <div className="columns-2 gap-4 space-y-4">
              {shortlistedItems.map((item, index) => (
                <div
                  className="break-inside-avoid"
                  key={`${item.name}-${item.spiceLevel}-${index}`}
                >
                  <ShortlistedItem
                    name={item.name}
                    quantity={item.quantity}
                    spiceLevel={item.spiceLevel}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-semibold ml-4">Active Orders</h2>
              <div className="flex items-center space-x-4 mr-4">
                <div className="flex items-center space-x-2 text-gray-800">
                  <div className="bg-yellow-200 h-4 w-4 border-gray-500 border"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-800">
                  <div className="bg-blue-200  h-4 w-4 border-gray-500 border"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-800">
                  <div className="bg-green-200 h-4 w-4 border-gray-500 border"></div>
                  <span>Completed</span>
                </div>
              </div>
              <div className="flex space-x-2">
                {["all", "table", "parcel"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`
                      px-3 py-2 rounded-md text-md capitalize
                      ${
                        activeFilter === filter
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }
                    `}
                  >
                    {filter} Orders
                  </button>
                ))}
              </div>
            </div>

            <div className="columns-3 gap-4 space-y-4">
              {getFilteredOrders().map((order) => (
                <div className="break-inside-avoid" key={order._id}>
                  <OrderCard
                    order={order}
                    onItemStatusUpdate={handleItemStatusUpdate}
                    isParcel={order.type === "Parcel"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KitchenScreen;
