const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    default: "Valued Customer"
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
        enum: ['Pending', 'Completed'],
        default: 'Pending',
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true, // Ensures totalAmount is always present
  },
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active',
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: "Unpaid"
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
