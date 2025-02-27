const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: function () {
      return this.type === 'Dine-In'; // Required only for dine-in orders
    },
  },
  sessionId: {
    type: String,
    required: function () {
      return this.type === 'Dine-In'; // Required only for dine-in orders
    },
  },
  restaurantId: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    default: "Valued Customer",
  },
  items: [
    {
      itemId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        default: null,
      },
      spiceLevel: {
        type: String,
        enum: ['Mild', 'Medium', 'Spicy'],
        default: 'Medium',
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
      },
    },
  ],
  type: {
    type: String,
    enum: ['Dine-In', 'Parcel'],
    default: 'Dine-In',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active',
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: "Unpaid",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };
