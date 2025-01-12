const { Admin } = require('../models/admin');
const { Restaurant } = require('../models/Restaurant');
const { Menu } = require('../models/Menu');

const generateToken = require('../utils/generateToken');

const signupAdmin = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const existingAdmin = await Admin.findOne({ email: email });
        if (existingAdmin) {
            return res.status(409).json({ error: 'Email is already registered.' });
        }

        const admin = await Admin.create({
            name,
            email,
            password,
            phone,
        });

        // Generate JWT token after successful admin creation
        const token = generateToken(admin._id);

        res.status(201).json({
            message: 'Admin registered successfully.',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
            token,  // Return the generated token
        });
    } catch (error) {
        console.error('Error in signupAdmin:', error.message);
        res.status(500).json({ error: 'An error occurred while registering the admin.' });
    }
};





const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const admin = await Admin.findOne({
            username: req.body.username,
            password: req.body.password
        })

        if (!admin) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }


        const token = generateToken(admin._id);

        res.json({
            message: 'Login successful.',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
            token,
        });
    } catch (error) {
        console.error('Error in loginAdmin:', error.message);
        res.status(500).json({ error: 'An error occurred while logging in.' });
    }
};



const getAdminProfile = async (req, res) => {
    try {
        // Get the admin ID from the request user (set by the auth middleware)
        const adminId = req.user;

        // Find the admin by ID
        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found.' });
        }

        // Return the admin profile
        res.json({
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
            },
        });
    } catch (error) {
        console.error('Error in getAdminProfile:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching the admin profile.' });
    }
};




const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.user;  // Get admin ID from the auth middleware

        const { name, email, phone } = req.body;

        // Validate input data
        if (!name && !email && !phone) {
            return res.status(400).json({ error: 'At least one field (name, email, phone) is required.' });
        }

        // Find the admin and update their profile
        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found.' });
        }

        // Update fields if provided
        if (name) admin.name = name;
        if (email) admin.email = email;
        if (phone) admin.phone = phone;

        // Save the updated admin data
        await admin.save();

        res.json({
            message: 'Admin profile updated successfully.',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
            },
        });
    } catch (error) {
        console.error('Error in updateAdminProfile:', error.message);
        res.status(500).json({ error: 'An error occurred while updating the admin profile.' });
    }
};



const addRestaurant = async (req, res) => {
    try {
        const { name, location, contact, description } = req.body;

        // Check if all fields are provided
        if (!name || !location || !contact || !description) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if the restaurant already exists for the admin
        const existingRestaurant = await Restaurant.findOne({ admin: req.user.id });
        if (existingRestaurant) {
            return res.status(409).json({ error: 'Restaurant is already registered.' });
        }

        // Create a new restaurant associated with the admin
        const restaurant = await Restaurant.create({
            name,
            location,
            contact,
            description,
            admin: req.user.id,  // Using the admin ID from the protected route (JWT)
        });

        res.status(201).json({
            message: 'Restaurant registered successfully.',
            restaurant: {
                id: restaurant._id,
                name: restaurant.name,
                location: restaurant.location,
                contact: restaurant.contact,
                description: restaurant.description,
            },
        });
    } catch (error) {
        console.error('Error in addRestaurant:', error.message);
        res.status(500).json({ error: 'An error occurred while registering the restaurant.' });
    }
};



const getRestaurant = async (req, res) => {
    try {
        // Find the restaurant associated with the logged-in admin
        const restaurant = await Restaurant.findOne({ admin: req.user.id });

        // If the restaurant is not found, return a 404 error
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }

        // Return the restaurant details
        res.status(200).json({
            message: 'Restaurant details retrieved successfully.',
            restaurant: {
                id: restaurant._id,
                name: restaurant.name,
                location: restaurant.location,
                contact: restaurant.contact,
                description: restaurant.description,
            },
        });
    } catch (error) {
        console.error('Error in getRestaurant:', error.message);
        res.status(500).json({ error: 'An error occurred while retrieving the restaurant details.' });
    }
};


const updateRestaurant = async (req, res) => {
    try {
        const { name, location, contact, description } = req.body;

        // Check if the restaurant exists for the logged-in admin
        const restaurant = await Restaurant.findOne({ admin: req.user.id });
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }

        // Update the restaurant details
        if (name) restaurant.name = name;
        if (location) restaurant.location = location;
        if (contact) restaurant.contact = contact;
        if (description) restaurant.description = description;

        // Save the updated restaurant details
        await restaurant.save();

        res.status(200).json({
            message: 'Restaurant details updated successfully.',
            restaurant: {
                id: restaurant._id,
                name: restaurant.name,
                location: restaurant.location,
                contact: restaurant.contact,
                description: restaurant.description,
            },
        });
    } catch (error) {
        console.error('Error in updateRestaurant:', error.message);
        res.status(500).json({ error: 'An error occurred while updating the restaurant details.' });
    }
};


const addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image, isAvailable, tags, ingredients } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({ error: 'Name, description, price, and category are required fields.' });
        }

        // Create a new menu item
        const newMenuItem = await Menu.create({
            restaurantid: req.user.restaurant, // Assuming restaurant ID is stored in the authenticated user's data
            name,
            description,
            price,
            category,
            image,
            isAvailable,
            tags,
            ingredients,
        });

        res.status(201).json({
            message: 'Menu item added successfully.',
            menuItem: {
                id: newMenuItem._id,
                name: newMenuItem.name,
                description: newMenuItem.description,
                price: newMenuItem.price,
                category: newMenuItem.category,
                image: newMenuItem.image,
                isAvailable: newMenuItem.isAvailable,
                tags: newMenuItem.tags,
                ingredients: newMenuItem.ingredients,
            },
        });
    } catch (error) {
        console.error('Error in addMenuItem:', error.message);
        res.status(500).json({ error: 'An error occurred while adding the menu item.' });
    }
};



module.exports = { signupAdmin, loginAdmin, getAdminProfile, updateAdminProfile, addRestaurant, getRestaurant ,updateRestaurant,addMenuItem};
