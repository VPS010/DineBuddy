import React, { useState, useEffect } from 'react';

const AdminOrdersPage = () => {
  // State management for orders and filters
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('today');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data - replace with actual API calls
  const mockOrders = [
    {
      id: 'ORD-001',
      tableNo: '12',
      items: ['Burger', 'Fries', 'Coke'],
      totalPrice: 25.99,
      status: 'Pending',
      orderTime: '2025-01-14T10:30:00',
      customerName: 'John Doe',
      paymentStatus: 'Unpaid',
      specialRequests: 'Extra sauce on burger'
    },
    {
      id: 'ORD-002',
      tableNo: '12',
      items: ['Burger', 'Fries', 'Coke'],
      totalPrice: 25.99,
      status: 'Pending',
      orderTime: '2025-01-14T10:30:00',
      customerName: 'John Doe',
      paymentStatus: 'Unpaid',
      specialRequests: 'Extra sauce on burger'
    },
    {
      id: 'ORD-003',
      tableNo: '12',
      items: ['Burger', 'Fries', 'Coke'],
      totalPrice: 25.99,
      status: 'Pending',
      orderTime: '2025-01-14T10:30:00',
      customerName: 'John Doe',
      paymentStatus: 'Unpaid',
      specialRequests: 'Extra sauce on burger'
    },
    {
      id: 'ORD-004',
      tableNo: '12',
      items: ['Burger', 'Fries', 'Coke'],
      totalPrice: 25.99,
      status: 'Pending',
      orderTime: '2025-01-14T10:30:00',
      customerName: 'John Doe',
      paymentStatus: 'Unpaid',
      specialRequests: 'Extra sauce on burger'
    },
    {
      id: 'ORD-005',
      tableNo: '12',
      items: ['Burger', 'Fries', 'Coke'],
      totalPrice: 25.99,
      status: 'Pending',
      orderTime: '2025-01-14T10:30:00',
      customerName: 'John Doe',
      paymentStatus: 'Unpaid',
      specialRequests: 'Extra sauce on burger'
    },
    // Add more mock orders as needed
  ];          

  // Summary calculations
  const summary = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
    completedOrders: orders.filter(order => order.status === 'Completed').length,
    pendingOrders: orders.filter(order => order.status === 'Pending').length
  };

  useEffect(() => {
    // Simulating API fetch
    setOrders(mockOrders);
  }, []);

  // Filter handlers
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tableNo.includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Action handlers
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleMarkCompleted = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'Completed' } : order
    ));
  };

  const handleCheckout = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'Completed', paymentStatus: 'Paid' } : order
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
        <div className="flex flex-wrap gap-4">
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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            className="p-2 border rounded"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Total Orders Today</h3>
          <p className="text-2xl">{summary.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Total Revenue</h3>
          <p className="text-2xl">₹{summary.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Completed Orders</h3>
          <p className="text-2xl">{summary.completedOrders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Pending Orders</h3>
          <p className="text-2xl">{summary.pendingOrders}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Table No.</th>
              <th className="p-4 text-left">Items</th>
              <th className="p-4 text-left">Total Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Order Time</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="p-4">
                  <button 
                    onClick={() => handleOrderClick(order)}
                    className="text-blue-600 hover:underline"
                  >
                    {order.id}
                  </button>
                </td>
                <td className="p-4">{order.tableNo}</td>
                <td className="p-4">{order.items.join(', ')}</td>
                <td className="p-4">₹{order.totalPrice.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(order.orderTime).toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkCompleted(order.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleCheckout(order.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Checkout
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-bold">Order ID: {selectedOrder.id}</p>
                <p>Table Number: {selectedOrder.tableNo}</p>
                <p>Customer: {selectedOrder.customerName}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Items:</h3>
                <ul className="list-disc pl-5">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p>Special Requests: {selectedOrder.specialRequests}</p>
                <p>Payment Status: {selectedOrder.paymentStatus}</p>
                <p className="font-bold">Total Amount: ${selectedOrder.totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => {
                    handleMarkCompleted(selectedOrder.id);
                    setIsDetailModalOpen(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark as Completed
                </button>
                <button 
                  onClick={() => {
                    handleCheckout(selectedOrder.id);
                    setIsDetailModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="mt-6 flex gap-4">
        <button 
          onClick={() => setOrders(mockOrders)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Refresh Orders
        </button>
        <button 
          onClick={() => {
            const csv = 'data:text/csv;charset=utf-8,' + 
              encodeURIComponent(orders.map(order => 
                Object.values(order).join(',')
              ).join('\n'));
            const link = document.createElement('a');
            link.href = csv;
            link.download = 'orders.csv';
            link.click();
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Export Orders
        </button>
      </div>
    </div>
  );
};
          
export default AdminOrdersPage;