import React, { useState } from "react";

// Utility function for formatting dates
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

// Custom Button Component
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

// Custom Card Component
const Card = ({ title, value, className = "" }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
    <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

// Custom Table Component
const Table = ({ data, columns, onRowClick }) => (
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
        {data.map((row) => (
          <tr
            key={row.id}
            onClick={() => onRowClick(row)}
            className="hover:bg-gray-50 cursor-pointer"
          >
            {columns.map((column) => (
              <td
                key={`${row.id}-${column.key}`}
                className="px-6 py-4 whitespace-nowrap"
              >
                {column.render ? column.render(row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Custom Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Main Dashboard Component
const AdminOrder = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders] = useState([
    {
      id: 1,
      tableNumber: "T1",
      status: "active",
      amount: 150.0,
      createdAt: new Date(),
      items: [
        { name: "Burger", quantity: 2, price: 25 },
        { name: "Fries", quantity: 1, price: 5 },
      ],
    },
    // Add more sample orders as needed
  ]);

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
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Order Management
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Notifications</Button>
              <Button variant="ghost">Profile</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card title="Total Orders" value="100" />
          <Card title="Active Orders" value="20" />
          <Card title="Completed Orders" value="70" />
          <Card title="Pending Orders" value="10" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button>Today's Orders</Button>
          <Button>Active Orders</Button>
          <Button>Pending Orders</Button>
          <Button>Completed Orders</Button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow">
          <Table
            data={orders}
            columns={columns}
            onRowClick={(order) => setSelectedOrder(order)}
          />
        </div>
      </main>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div>
            <div className="mb-4">
              <h3 className="font-medium">Order Details</h3>
              <p>Table: {selectedOrder.tableNumber}</p>
              <p>Amount: ${selectedOrder.amount.toFixed(2)}</p>
              <p>Status: {selectedOrder.status}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
              <Button variant="success">Mark as Completed</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrder;
