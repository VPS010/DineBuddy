import React, { useState } from "react";
import Button from "./Button";
import { Trash2, ChevronRight } from "lucide-react";

const OrderTable = ({
  filteredOrders,
  calculateTotalWithTax,
  handleMarkAsCompleted,
  handleCheckout,
  setExpandedOrder,
  handleDeleteOrder,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [closedOrders, setClosedOrders] = useState(new Set());

  const confirmDelete = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      handleDeleteOrder(orderToDelete);
      setShowDeleteDialog(false);
      setOrderToDelete(null);
    }
  };

  const handleClose = (orderId) => {
    setClosedOrders((prev) => new Set([...prev, orderId]));
    handleMarkAsCompleted(orderId);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="w-full">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Table
                </th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setExpandedOrder(order)}
                  className={`cursor-pointer ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-50 hover:bg-green-100"
                      : closedOrders.has(order.id)
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span>{order.id}</span>
                      <ChevronRight className="w-4 h-4 ml-2 md:hidden text-gray-400" />
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm">
                    T-{order.tableNumber}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap text-sm">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Active"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    ₹{calculateTotalWithTax(order).toFixed(2)}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {order.paymentStatus !== "Paid" && (
                      <div
                        className="flex flex-wrap justify-around gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {closedOrders.has(order.id) ? (
                          <Button
                            variant="secondary"
                            className="text-xs md:text-sm px-2 py-1 bg-gray-400 hover:bg-gray-400 text-white cursor-default"
                          >
                            Closed
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            onClick={() => handleClose(order.id)}
                            className="text-xs md:text-sm px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Close
                          </Button>
                        )}
                        <Button
                          variant="primary"
                          onClick={() => handleCheckout(order.id)}
                          className="text-xs md:text-sm px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Paid
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => confirmDelete(order.id)}
                          className="text-xs md:text-sm px-2 py-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this order? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderTable;
