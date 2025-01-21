import React, { useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";

const OrderStats = ({ orders, showRevenue, setShowRevenue, TAX_RATE }) => {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter orders for today
    const ordersToday = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    // Calculate stats for all orders
    const allTimeStats = orders.reduce(
      (acc, order) => {
        const subtotal = order.items.reduce(
          (itemSum, item) => itemSum + item.price * item.quantity,
          0
        );
        const total = subtotal * (1 + TAX_RATE);

        if (order.paymentStatus === "Paid") {
          acc.totalRevenue += total;
          acc.completedOrders += 1;
        } else {
          acc.pendingOrders += 1;
        }

        return acc;
      },
      { totalRevenue: 0, completedOrders: 0, pendingOrders: 0 }
    );

    // Get today's stats
    const todayStats = {
      completedOrders: ordersToday.filter(
        (order) => order.paymentStatus === "Paid"
      ).length,
      pendingOrders: ordersToday.filter(
        (order) => order.paymentStatus === "Unpaid"
      ).length,
    };

    // Get active tables
    const activeTableSet = new Set(
      orders
        .filter(
          (order) =>
            order.status === "Active" && order.paymentStatus === "Unpaid"
        )
        .map((order) => order.tableNumber)
    );

    return {
      today: {
        totalOrders: ordersToday.length,
        ...todayStats,
      },
      allTime: {
        totalOrders: orders.length,
        ...allTimeStats,
      },
      activeTables: {
        total: activeTableSet.size,
        tables: Array.from(activeTableSet).sort((a, b) => a - b),
      },
    };
  }, [orders, TAX_RATE]);

  return (
    <div className="space-y-4 mb-4">
      {/* All-time Stats */}
      <div>
        <h2 className="text-xl font-bold mb-3 text-gray-800">
          Orders Overview
        </h2>{" "}
        <div className="flex flex-wrap gap-4">
          <div className="bg-white p-4 rounded-md shadow flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
            <p className="text-2xl font-medium">{stats.allTime.totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold mb-2">Total Completed</h3>
            <p className="text-2xl font-medium">
              {stats.allTime.completedOrders}
            </p>
          </div>

          <div className="bg-white p-4 rounded-md shadow flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold mb-2">Total Pending</h3>
            <p className="text-2xl font-medium">
              {stats.allTime.pendingOrders}
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
              Total Revenue (Inc. Tax)
              <button
                onClick={() => setShowRevenue(!showRevenue)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showRevenue ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </h3>
            <p className="text-2xl font-medium">
              {showRevenue
                ? `₹${new Intl.NumberFormat("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(stats.allTime.totalRevenue)}`
                : "₹********"}
            </p>
          </div>
        </div>
      </div>

      {/* Active Tables Section */}
      <div className="bg-white rounded shadow flex-1 mt-0 flex">
        <div className="min-w-[150px] p-4">
          <h3 className="text-xl font-semibold text-gray-800">Active Tables</h3>
          <span className="text-md text-gray-500">Total Active</span>
          <span className="font-semibold text-md ml-4">
            {stats.activeTables.total}
          </span>
        </div>

        <div className="space-y-6 p-2 m-2 w-full rounded-md bg-gray-50">
          <div className="flex flex-wrap gap-3">
            {stats.activeTables.tables.map((table) => (
              <span
                key={table}
                className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
              >
                Table {table}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
