const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please provide a valid phone number'],
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Assuming Restaurant model exists
        required: null, // Admin should be associated with a restaurant
    },
    profileImage: {
        type: String, // URL of the profile image
        default: null,
    },
});




const Admin = mongoose.model('Admin', adminSchema);

module.exports = { Admin };
