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
        required: false,  // No longer required; default value can be null
    },
    contact: {
        type: String,
        required: false,  // No longer required; default value can be null
    },
    description: {
        type: String,
        required: false,  // No longer required; default value can be null
    },
    businessHours: {
        type: Map,
        of: String, // Key-value pairs for days and hours (Mon-Sun: 11:00 AM - 10:00 PM)
        default: {
            Monday: "11:00 AM - 10:00 PM",
            Tuesday: "11:00 AM - 10:00 PM",
            Wednesday: "11:00 AM - 10:00 PM",
            Thursday: "11:00 AM - 10:00 PM",
            Friday: "11:00 AM - 10:00 PM",
            Saturday: "11:00 AM - 10:00 PM",
            Sunday: "11:00 AM - 10:00 PM",
        },
    },
    memberSince: {
        type: Date,
        default: Date.now,  // Automatically set to the current date when a new restaurant is created
    },
    // Geo-fence field (optional):
    geoFence: {
        coordinates: {
            type: [[Number]],  // Array of two corner coordinates: [lat1, lng1], [lat2, lng2]
            required: false,    // Not required during restaurant creation
        },
    },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = { Restaurant };
