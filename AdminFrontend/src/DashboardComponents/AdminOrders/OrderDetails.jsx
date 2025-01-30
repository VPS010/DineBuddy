import React, { useState, useMemo, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "./Button";
import SpiceLevelDropdown from "./SpiceLevelDropdown";
import { X, Plus, Printer, Search } from "lucide-react";

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
  const searchInputRef = useRef(null);
  const orderDetailsRef = useRef(null);
  const printDivRef = useRef(null);
  const isPaid = expandedOrder?.paymentStatus === "Paid";

  // Get row background color based on status
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

  // Check if item can be updated
  const canUpdateItem = (status) => {
    return status === "Pending";
  };

  // Generate a unique ID for new items
  const generateUniqueId = () => {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

  const handleItemDelete = async (itemId) => {
    const itemName = expandedOrder.items.find(
      (item) => item.id === itemId
    )?.name;
    await handleDeleteItem(itemId);
    toast.success(`${itemName} removed from order`);
  };

  const handleSpiceLevelUpdate = (itemId, level) => {
    const item = expandedOrder.items.find((item) => item.id === itemId);
    if (!canUpdateItem(item.status)) {
      toast.error("Cannot update items that are In Progress or Completed");
      return;
    }

    handleSpiceLevelChange(itemId, level);
    toast.info(`Updated spice level for ${item.name} to ${level}`);
  };

  const handleQuantityUpdate = (itemId, quantity) => {
    const item = expandedOrder.items.find((item) => item.id === itemId);
    if (!canUpdateItem(item.status)) {
      toast.error("Cannot update items that are In Progress or Completed");
      return;
    }

    handleQuantityChange(itemId, quantity);
    toast.info(`Updated quantity for ${item.name} to ${quantity}`);
  };


  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setExpandedOrder(null);
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleModalClick}
    >
      {/* Normal View */}
      <div
        className="bg-white p-8 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Menu Search Section */}
        {!isPaid && (
          <div className="w-1/3 pr-4 border-r flex flex-col">
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
                  <div>
                    <span className="font-medium">{menuItem.name}</span>
                    <span className="text-gray-500 ml-2">
                      ₹{menuItem.price.toFixed(2)}
                    </span>
                  </div>
                  <Plus className="text-green-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details Section */}
        <div
          ref={orderDetailsRef}
          className={`${
            !isPaid ? "w-2/3 pl-4" : "w-full"
          } flex flex-col overflow-hidden`}
        >
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">{restaurantInfo.name}</h2>
              <p className="text-gray-600">{restaurantInfo.address}</p>
              <p className="text-gray-600">{restaurantInfo.phone}</p>
            </div>

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

            <div className="overflow-x-auto">
              <table className="w-full mb-6">
                <thead>
                  <tr className="bg-gray-50 sticky top-0">
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Spice Level</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Subtotal</th>
                    {!isPaid && <th className="px-4 py-2">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {expandedOrder.items.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b ${getStatusColor(item.status)}`}
                    >
                      <td className="px-4 py-2">
                        <span className="font-medium">{item.name}</span>
                      </td>
                      <td className="px-4 py-2">
                        <span>{item.status}</span>
                      </td>
                      <td className="px-4 py-2">
                        {isPaid || !canUpdateItem(item.status) ? (
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
                        {isPaid || !canUpdateItem(item.status) ? (
                          <span>{item.quantity}</span>
                        ) : (
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityUpdate(item.id, e.target.value)
                            }
                            className="w-20 px-2 py-1 border rounded"
                            disabled={isSaving}
                          />
                        )}
                      </td>
                      <td className="px-4 py-2">₹{item.price.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                      {!isPaid && (
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleItemDelete(item.id)}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            disabled={isSaving || !canUpdateItem(item.status)}
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

            <div className="flex flex-col items-end space-y-2 mb-8">
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
              onClick={() => setExpandedOrder(null)}
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
