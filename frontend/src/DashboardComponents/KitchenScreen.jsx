import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import OrderCard from '../components/OrderCard';
import ShortlistedItem from '../components/ShortlistedItem';

// Sample initial data
const initialOrders = [
  { id: 1, table: 3, items: { "Burger": 2, "Fries": 1 }, status: "Pending", timestamp: new Date().toISOString() },
  { id: 2, table: 5, items: { "Pizza": 1, "Coke": 2 }, status: "In Progress", timestamp: new Date().toISOString() },
  { id: 3, table: 1, items: { "Burger": 1, "Pizza": 1, "Fries": 2 }, status: "Pending", timestamp: new Date().toISOString() }
];


const KitchenScreen = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [shortlistedItems, setShortlistedItems] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update clock every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Calculate shortlisted items whenever orders change
    const items = {};
    orders.forEach(order => {
      if (order.status !== "Completed") {
        Object.entries(order.items).forEach(([item, quantity]) => {
          items[item] = (items[item] || 0) + quantity;
        });
      }
    });
    setShortlistedItems(items);
  }, [orders]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleRefresh = () => {
    // Simulate data refresh
    setOrders(orders.filter(order => order.status !== "Completed"));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Kitchen Screen</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Orders */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
            <div className="space-y-4">
              {orders
                .filter(order => order.status !== "Completed")
                .map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              }
            </div>
          </div>

          {/* Right Panel - Shortlisted Items */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Shortlisted Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(shortlistedItems).map(([item, quantity]) => (
                <ShortlistedItem
                  key={item}
                  name={item}
                  quantity={quantity}
                  status={orders.some(o => 
                    o.items[item] && o.status === "In Progress"
                  ) ? "In Progress" : "Pending"}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh Orders</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default KitchenScreen;