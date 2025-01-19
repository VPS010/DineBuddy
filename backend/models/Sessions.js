const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({

    tableNumber: {
        type: String,
        required: true
    },
    restaurantId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Closed'],
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = { Session }