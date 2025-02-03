import React, { useState, useMemo, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "./Button";
import SpiceLevelDropdown from "./SpiceLevelDropdown";
import { X, Plus, Printer, Search } from "lucide-react";

const ConfirmDialog = ({
  show,
  onConfirm,
  onCancel,
  message,
  confirmText,
  cancelText,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <p className="mb-4 text-gray-700">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            onClick={onCancel}
          >
            {cancelText || "Cancel"}
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={onConfirm}
          >
            {confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderDetails = ({
  expandedOrder,
  setExpandedOrder,
  handleCustomerNameChange,
  handleSpiceLevelChange,
  handleQuantityChange,
  handleDeleteItem,
  handleSaveChanges: onSaveChanges,
  hasChanges,
  restaurantInfo,
  calculateSubtotal,
  calculateTax,
  TAX_RATE,
  availableMenuItems,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [localHasChanges, setLocalHasChanges] = useState(hasChanges);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const searchInputRef = useRef(null);
  const orderDetailsRef = useRef(null);
  const printDivRef = useRef(null);
  const isPaid = expandedOrder?.paymentStatus === "Paid";

  // Existing functions remain the same...
  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-50";
      case "Completed":
        return "bg-green-50";
      default:
        return "";
    }
  };

  // Generate a unique ID for new items
  const generateUniqueId = () => {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (localHasChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [localHasChanges]);

  const handleModalClose = () => {
    if (localHasChanges) {
      setShowCloseDialog(true);
    } else {
      setExpandedOrder(null);
    }
  };

  const handleCloseConfirm = async () => {
    try {
      await handleSaveChanges();
      setShowCloseDialog(false);
      setExpandedOrder(null);
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const handleCloseWithoutSaving = () => {
    setShowCloseDialog(false);
    setExpandedOrder(null);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      if (localHasChanges) {
        setShowCloseDialog(true);
      } else {
        setExpandedOrder(null);
      }
    }
  };

  const initiateItemEdit = (item, onConfirm) => {
    if (item.status === "In Progress" || item.status === "Completed") {
      setItemToEdit({ ...item, onConfirm });
      setShowEditDialog(true);
    } else {
      onConfirm();
    }
  };

  const handleSpiceLevelUpdate = (itemId, level) => {
    const item = expandedOrder.items.find((item) => item.id === itemId);
    initiateItemEdit(item, () => {
      handleSpiceLevelChange(itemId, level);
      setLocalHasChanges(true);
    });
  };

  const handleQuantityUpdate = (itemId, quantity) => {
    const item = expandedOrder.items.find((item) => item.id === itemId);
    initiateItemEdit(item, () => {
      handleQuantityChange(itemId, quantity);
      setLocalHasChanges(true);
    });
  };

  const initiateItemDelete = (item) => {
    if (item.status === "In Progress" || item.status === "Completed") {
      setItemToDelete(item);
      setShowDeleteDialog(true);
    } else {
      handleItemDelete(item.id);
    }
  };

  const handleItemDelete = async (itemId) => {
    try {
      const itemName = expandedOrder.items.find(
        (item) => item.id === itemId
      )?.name;

      // Update the local state first
      const updatedItems = expandedOrder.items.filter(
        (item) => item.id !== itemId
      );
      setExpandedOrder({
        ...expandedOrder,
        items: updatedItems,
      });

      // Call the parent handler
      await handleDeleteItem(itemId);
      setLocalHasChanges(true);
      toast.success(`${itemName} removed from order`);
    } catch (error) {
      toast.error("Failed to delete item: " + error.message);
      // Revert the local state if the deletion fails
      setExpandedOrder({ ...expandedOrder });
    }
  };

  // Filter menu items based on search term
  const filteredMenuItems = useMemo(() => {
    if (!availableMenuItems) return [];
    return availableMenuItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableMenuItems, searchTerm]);

  // Handle adding an item from the menu list
  const handleMenuItemAdd = (menuItem) => {
    const newItem = {
      id: generateUniqueId(),
      itemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      spiceLevel: "Medium",
      image: menuItem.image,
      status: "Pending",
    };

    const updatedItems = [...expandedOrder.items, newItem];
    setExpandedOrder({
      ...expandedOrder,
      items: updatedItems,
    });
    setLocalHasChanges(true);
    toast.success(`Added ${menuItem.name} to the order`);
  };

  // Keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      await onSaveChanges(expandedOrder);
      setLocalHasChanges(false);
      toast.success("Changes saved successfully!");
    } catch (error) {
      toast.error("Error saving changes: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!expandedOrder) return null;

  const subtotal = calculateSubtotal(expandedOrder.items);
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  const handlePrintBill = () => {
    const printContent = document.createElement("iframe");
    printContent.style.display = "none";
    document.body.appendChild(printContent);

    printContent.contentDocument.write(`
      <html>
        <head>
          <title>Order #${expandedOrder.id} - ${restaurantInfo.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .totals {
              margin-top: 20px;
              text-align: right;
            }
            .thank-you {
              margin-top: 40px;
              text-align: center;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .order-info {
              margin-bottom: 20px;
            }
            .bold {
              font-weight: bold;
            }
            @media print {
              body {
                padding: 0;
                font-size: 12px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${restaurantInfo.name}</h1>
            <p>${restaurantInfo.address}</p>
            <p>${restaurantInfo.phone}</p>
          </div>
          
          <div class="order-info">
            <p><span class="bold">Order #:</span> ${expandedOrder.id}</p>
            <p><span class="bold">Table:</span> ${expandedOrder.tableNumber}</p>
            <p><span class="bold">Customer:</span> ${
              expandedOrder.customerName || "N/A"
            }</p>
            <p><span class="bold">Date:</span> ${new Date(
              expandedOrder.createdAt
            ).toLocaleString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Spice Level</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${expandedOrder.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.spiceLevel}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">₹${item.price.toFixed(2)}</td>
                  <td class="text-right">₹${(
                    item.price * item.quantity
                  ).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="totals">
            <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
            <p>Tax (${(TAX_RATE * 100).toFixed(0)}%): ₹${tax.toFixed(2)}</p>
            <p class="bold">Total: ₹${total.toFixed(2)}</p>
          </div>
          
          <div class="thank-you">
            <p>Thank you for dining with us!</p>
            <p>Please visit again</p>
          </div>
        </body>
      </html>
    `);

    printContent.contentDocument.close();

    // Wait for styles to load before printing
    setTimeout(() => {
      printContent.contentWindow.focus();
      printContent.contentWindow.print();

      // Remove the iframe after printing
      printContent.contentWindow.onafterprint = function () {
        document.body.removeChild(printContent);
      };
    }, 250);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleModalClick}
    >
      {/* Confirm dialogs remain the same */}
      <ConfirmDialog
        show={showDeleteDialog}
        message={`This item is ${itemToDelete?.status}. Are you sure you want to delete it?`}
        onConfirm={() => {
          handleItemDelete(itemToDelete.id);
          setShowDeleteDialog(false);
          setItemToDelete(null);
        }}
        onCancel={() => {
          setShowDeleteDialog(false);
          setItemToDelete(null);
        }}
      />

      <ConfirmDialog
        show={showEditDialog}
        message={`This item is ${itemToEdit?.status}. Do you want to modify it?`}
        onConfirm={() => {
          itemToEdit?.onConfirm();
          setShowEditDialog(false);
          setItemToEdit(null);
        }}
        onCancel={() => {
          setShowEditDialog(false);
          setItemToEdit(null);
        }}
      />

      <ConfirmDialog
        show={showCloseDialog}
        message="You have unsaved changes. Do you want to save before closing?"
        confirmText="Save & Close"
        cancelText="Close Without Saving"
        onConfirm={handleCloseConfirm}
        onCancel={handleCloseWithoutSaving}
      />

      <div
        className="bg-white rounded-lg w-full h-[90vh] max-w-6xl flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Menu Search Section */}
        {!isPaid && (
          <div className="w-full md:w-1/3 p-4 border-b md:border-b-0 md:border-r flex flex-col max-h-[30vh] md:max-h-full">
            <div className="relative mb-4">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search menu items (Ctrl + K)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-md pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="overflow-y-auto flex-grow">
              {filteredMenuItems.map((menuItem) => (
                <div
                  key={menuItem.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleMenuItemAdd(menuItem)}
                >
                  <div className="flex-grow">
                    <span className="font-medium">{menuItem.name}</span>
                    <span className="text-gray-500 ml-2">
                      ₹{menuItem.price.toFixed(2)}
                    </span>
                  </div>
                  <Plus className="text-green-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details Section */}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${
            !isPaid ? "md:w-2/3" : "w-full"
          } p-4`}
        >
          <div className="flex-grow overflow-y-auto">
            {/* Restaurant Info */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">{restaurantInfo.name}</h2>
              <p className="text-gray-600">{restaurantInfo.address}</p>
              <p className="text-gray-600">{restaurantInfo.phone}</p>
            </div>

            {/* Order Info */}
            <div className="mb-6 space-y-3">
              <h3 className="text-lg font-semibold">
                Order #{expandedOrder.id}
              </h3>
              <p>
                {expandedOrder.type === "Parcel"
                  ? "Parcel"
                  : `Table: ${expandedOrder.tableNumber}`}
              </p>
              <div className="flex items-center space-x-2">
                <span>Customer:</span>
                {isPaid ? (
                  <span>{expandedOrder.customerName || "N/A"}</span>
                ) : (
                  <input
                    type="text"
                    value={expandedOrder.customerName || ""}
                    onChange={(e) => {
                      handleCustomerNameChange(
                        expandedOrder.id,
                        e.target.value
                      );
                      setLocalHasChanges(true);
                    }}
                    className="px-2 py-1 border rounded"
                    placeholder="Customer name"
                    disabled={isSaving}
                  />
                )}
              </div>
              <p>Date: {new Date(expandedOrder.createdAt).toLocaleString()}</p>
            </div>

            {/* Items Table */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-4 text-left text-sm font-semibold text-gray-900">
                          Item
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                          Spice Level
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                          Qty
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="p-4 text-right text-sm font-semibold text-gray-900">
                          Price
                        </th>
                        {!isPaid && <th className="p-4 w-16"></th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {expandedOrder.items.map((item) => (
                        <tr
                          key={item.id}
                          className={getStatusColor(item.status)}
                        >
                          <td className="px-4 py-2">
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            {isPaid ? (
                              <span>{item.spiceLevel}</span>
                            ) : (
                              <SpiceLevelDropdown
                                value={item.spiceLevel}
                                onChange={(level) =>
                                  handleSpiceLevelUpdate(item.id, level)
                                }
                                disabled={isSaving}
                              />
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {isPaid ? (
                              <span>{item.quantity}</span>
                            ) : (
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityUpdate(item.id, e.target.value)
                                }
                                className="w-16 px-2 py-1 border rounded"
                                disabled={isSaving}
                              />
                            )}
                          </td>
                          <td className="px-4 py-2">{item.status}</td>
                          <td className="px-4 py-2 text-right">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                          {!isPaid && (
                            <td className="px-4 py-2 text-right">
                              <button
                                onClick={() => initiateItemDelete(item)}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                disabled={isSaving}
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="mt-6 flex flex-col items-end space-y-2">
              <p className="text-lg">Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p className="text-lg">
                Tax ({(TAX_RATE * 100).toFixed(0)}%): ₹{tax.toFixed(2)}
              </p>
              <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center space-x-3 mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleModalClose}
              disabled={isSaving}
            >
              Close
            </Button>
            {!isPaid && localHasChanges && (
              <Button
                variant="success"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handlePrintBill}
              disabled={isSaving}
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

export default OrderDetails;
