const mongoose = require('mongoose');
const { object } = require('zod');

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
        type: String, // Accept any string as a category
        required: true,
        trim: true,
    },
    image: {
        type: String, // URL for the image
        default: null,
    },
    dietary: {
        type: [String],
        default: [],
    },
    isVeg: {
        type: Boolean,
        required: true,
    },
    customization: {
        type: Object,
        default: {
            spiceLevel: ["Mild", "Medium", "Spicy"],
        },
    },
    spiceLevel: {
        type: String,
        enum: ['Mild', 'Medium', 'Spicy'],
        default: 'Medium',
    },
    popularity: {
        type: [String],
        default: [],
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = { Menu };
