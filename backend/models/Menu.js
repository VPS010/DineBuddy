const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    restaurantid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Appetizers', 'Mains', 'Desserts', 'Beverages', 'Specials'], // Add more as needed
    },
    image: {
        type: String, // URL for the image
        default: null,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    tags: {
        type: [String], // e.g., ["Best Seller", "Today's Special"]
        default: [],
    },
    ingredients: {
        type: [String], // List of ingredients
        default: [],
    },
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports ={ Menu};
