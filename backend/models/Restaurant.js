const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Reference to the Admin model
        required: true,
    },
    address: {
        type: String,
        required: null,
    },
    contact: {
        type: String,
        required: null,
    },
    description: {
        type: String,
        required: null,
    },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = { Restaurant };
