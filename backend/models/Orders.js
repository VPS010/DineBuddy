const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',  // Reference to the Restaurant model
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model (assuming the customer is a user)
        required: true,
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu',  // Reference to the Menu model (the items ordered)
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    deliveryDate: {
        type: Date,
        default: null,  // Will be set once the order is completed or delivered
    },
    deliveryAddress: {
        type: String,
        required: function () {
            return this.status === 'Completed' || this.status === 'Delivered';
        },
    },
    specialInstructions: {
        type: String,
        default: '',
    },
});

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;
