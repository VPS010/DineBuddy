const { Admin } = require('../models/admin');
const { Restaurant } = require('../models/Restaurant');
const { Menu } = require('../models/Menu');
const generateQRcode = require('../utils/qrCodeGenerator')
const generateToken = require('../utils/generateToken')
const { Session } = require('../models/Sessions')
const { Order } = require('../models/Orders')
const axios = require('axios');



const signupAdmin = async (req, res) => {
    try {
        const { name, email, password, phone, restaurantName } = req.body;

        if (!name || !email || !password || !phone || !restaurantName) {
            return res.status(400).json({ error: 'All fields, including restaurant name, are required.' });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ error: 'Email is already registered.' });
        }

        // Create the admin
        const admin = await Admin.create({
            name,
            email,
            password,
            phone,
        });

        // Create a default restaurant for the admin
        const restaurant = await Restaurant.create({
            name: restaurantName,
            adminId: admin._id,
        });

        // Link the restaurant ID to the admin
        admin.restaurant = restaurant._id;
        await admin.save();

        // Generate a token for the admin
        const token = generateToken(admin._id, admin.restaurant);

        res.status(201).json({
            message: 'Admin registered successfully.',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                restaurantId: admin.restaurant,
            },
            restaurant: {
                id: restaurant._id,
                name: restaurant.name,
            },
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


        const token = generateToken(admin._id, admin.restaurant);

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
        const adminId = req.user.id;

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
        const adminId = req.user.id;  // Get admin ID from the auth middleware

        const { name, email, password } = req.body;

        // Validate input data
        if (!name && !email && !password) {
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
        if (password) admin.password = password;

        // Save the updated admin data
        await admin.save();

        res.json({
            message: 'Admin profile updated successfully.',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                password: admin.password,
            },
        });
    } catch (error) {
        console.error('Error in updateAdminProfile:', error.message);
        res.status(500).json({ error: 'An error occurred while updating the admin profile.' });
    }
};


const updateRestaurant = async (req, res) => {
    try {
        const { name, address, contact, description, businessHours, geoFence } = req.body;

        console.log('Received geoFence data:', geoFence);

        // Check if the restaurant exists for the logged-in admin
        const restaurant = await Restaurant.findOne({ adminId: req.user.id });
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }

        // Update the restaurant details
        if (name) restaurant.name = name;
        if (address) restaurant.address = address;
        if (contact) restaurant.contact = contact;
        if (description) restaurant.description = description;

        // Update business hours if provided
        if (businessHours) {
            restaurant.businessHours = new Map(Object.entries(businessHours));
        }
        if (geoFence && geoFence.coordinates) {
            // Validate the geofence format
            if (
                Array.isArray(geoFence.coordinates) &&
                geoFence.coordinates.length === 2 &&
                geoFence.coordinates.every(
                    (point) =>
                        Array.isArray(point) &&
                        point.length === 2 &&
                        typeof point[0] === 'number' &&
                        typeof point[1] === 'number'
                )
            ) {
                // Assign the entire geoFence object with coordinates
                restaurant.geoFence = {
                    coordinates: geoFence.coordinates
                };
                console.log('Saving geoFence:', restaurant.geoFence); // Debug log
            } else {
                return res.status(400).json({ error: 'Invalid geofence coordinates format.' });
            }
        }


        // Save the updated restaurant details
        await restaurant.save();
        console.log('Saved restaurant geoFence:', restaurant.geoFence);

        res.status(200).json({
            message: 'Restaurant details updated successfully.',
            restaurant: {
                id: restaurant._id,
                name: restaurant.name,
                address: restaurant.address,
                contact: restaurant.contact,
                description: restaurant.description,
                businessHours: Object.fromEntries(restaurant.businessHours), // Convert Map to object for response
                geoFence: restaurant.geoFence,
                memberSince: restaurant.memberSince,
            },
        });
    } catch (error) {
        console.error('Error in updateRestaurant:', error.message);
        res.status(500).json({ error: 'An error occurred while updating the restaurant details.' });
    }
};

const getRestaurant = async (req, res) => {
    try {
        // Find the restaurant associated with the logged-in admin
        const restaurant = await Restaurant.findOne({ adminId: req.user.id });

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
                address: restaurant.address,
                contact: restaurant.contact,
                description: restaurant.description,
                businessHours: Object.fromEntries(restaurant.businessHours), // Convert Map to object
                geofence: restaurant.geoFence, // Include geofence in the response
                memberSince: restaurant.memberSince,
            },
        });
    } catch (error) {
        console.error('Error in getRestaurant:', error.message);
        res.status(500).json({ error: 'An error occurred while retrieving the restaurant details.' });
    }
};



// Utility function to upload image to ImgB
const uploadToImgBB = async (base64Image) => {
    try {
        // Extract the base64 data from the data URL
        const base64Data = base64Image.split(';base64,').pop();

        // Create form data
        const formData = new URLSearchParams();
        formData.append('key', process.env.IMGBB_API_KEY);
        formData.append('image', base64Data);

        const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data && response.data.data && response.data.data.url) {
            return response.data.data.url;
        } else {
            throw new Error('Invalid response from ImgBB');
        }
    } catch (error) {
        console.error('ImgBB upload error:', error.response?.data || error.message);
        throw new Error('Failed to upload image to ImgBB');
    }
};


const addMenuItem = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            isAvailable,
            dietary,
            isVeg,
            spiceLevel,
            popularity,
        } = req.body;

        // Check for required fields
        if (!name || !description || !price || !category || typeof isVeg === 'undefined' || !spiceLevel) {
            return res.status(400).json({
                error: 'Name, description, price, category, isVeg, and spiceLevel are required fields.',
            });
        }

        // Validate spice level
        const validSpiceLevels = ['Mild', 'Medium', 'Spicy'];
        if (!validSpiceLevels.includes(spiceLevel)) {
            return res.status(400).json({
                error: `Invalid spice level. Valid values are: ${validSpiceLevels.join(', ')}.`,
            });
        }

        // Upload image to ImgBB if provided
        let imageUrl = null;
        if (image && image !== '/api/placeholder/400/400') {
            try {
                imageUrl = await uploadToImgBB(image);
            } catch (error) {
                console.error('Image upload error:', error);
                return res.status(400).json({
                    error: 'Failed to upload image. Please try again.',
                });
            }
        }

        // Create a new menu item
        const newMenuItem = await Menu.create({
            restaurantid: req.user.restaurantId,
            name,
            description,
            price,
            category,
            image: imageUrl || '/api/placeholder/400/400', // Use placeholder if no image
            isAvailable: isAvailable ?? true,
            dietary: dietary || [],
            isVeg,
            spiceLevel,
            popularity: popularity || [],
        });

        res.status(201).json({
            message: 'Menu item added successfully.',
            menuItem: newMenuItem
        });
    } catch (error) {
        console.error('Error in addMenuItem:', error);
        res.status(500).json({ error: 'An error occurred while adding the menu item.' });
    }
};

const getMenu = async (req, res) => {
    try {
        // Get the restaurant ID from the authenticated user's data
        const restaurantId = req.user.restaurant; // Assuming restaurant ID is stored in the user's data after signup

        // Retrieve all menu items for the specified restaurant
        const menuItems = await Menu.find({ restaurantid: req.user.restaurantId });

        if (menuItems.length === 0) {
            return res.status(404).json({ error: 'No menu items found for this restaurant.' });
        }

        res.status(200).json({
            message: 'Menu items retrieved successfully.',
            menuItems,
        });
    } catch (error) {
        console.error('Error in getMenu:', error.message);
        res.status(500).json({ error: 'An error occurred while retrieving the menu items.' });
    }
};




const getMenuItem = async (req, res) => {
    try {
        // Extract the menu item ID from the route parameters
        const { id } = req.params;

        // Retrieve the specific menu item by its ID
        const menuItem = await Menu.findById(id);

        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found.' });
        }

        res.status(200).json({
            message: 'Menu item retrieved successfully.',
            menuItem,
        });
    } catch (error) {
        console.error('Error in getMenuItem:', error.message);
        res.status(500).json({ error: 'An error occurred while retrieving the menu item.' });
    }
};




const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            price,
            category,
            image,
            isAvailable,
            dietary,
            isVeg,
            spiceLevel,
            popularity,
        } = req.body;

        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found.' });
        }

        // Upload new image to ImgBB only if a new image is provided
        let imageUrl = menuItem.image;
        if (image && image !== menuItem.image && image !== '/api/placeholder/400/400') {
            try {
                imageUrl = await uploadToImgBB(image);
            } catch (error) {
                console.error('Image upload error:', error);
                return res.status(400).json({
                    error: 'Failed to upload image. Please try again.',
                });
            }
        }

        // Update fields
        if (name) menuItem.name = name;
        if (description) menuItem.description = description;
        if (price) menuItem.price = price;
        if (category) menuItem.category = category;
        menuItem.image = imageUrl;
        if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;
        if (dietary) menuItem.dietary = dietary;
        if (isVeg !== undefined) menuItem.isVeg = isVeg;
        if (spiceLevel) menuItem.spiceLevel = spiceLevel;
        if (popularity) menuItem.popularity = popularity;

        await menuItem.save();

        res.status(200).json({
            message: 'Menu item updated successfully.',
            menuItem
        });
    } catch (error) {
        console.error('Error in updateMenuItem:', error);
        res.status(500).json({ error: 'An error occurred while updating the menu item.' });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the menu item by its ID and delete it
        const menuItem = await Menu.findByIdAndDelete(id);

        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found.' });
        }

        res.status(200).json({
            message: 'Menu item deleted successfully.',
        });
    } catch (error) {
        console.error('Error in deleteMenuItem:', error.message);
        res.status(500).json({ error: 'An error occurred while deleting the menu item.' });
    }
};

const generateQRCode = async (req, res) => {
    try {
        const { tableNumber } = req.body;
        const restaurantId = req.user.restaurantId;  // restaurantId is from Auth

        // Use the generateQRCode utility to get the QR code
        const qrCodeData = await generateQRcode(restaurantId, tableNumber);

        // Await Restaurant.findOne to get the restaurant details
        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
        });

        res.status(200).json({
            message: 'QR code generated successfully.',
            qrCode: qrCodeData,  // The base64-encoded image
            restaurant: restaurant.name,
        });
    } catch (error) {
        console.error('Error in QR code generation:', error);
        res.status(500).json({ error: error.message || 'An error occurred while generating the QR code.' });
    }
};



//Orders and Sessions management

// Get all sessions for a restaurant
const allSessions = async (req, res) => {
    try {
        const { restaurantId } = req.user;
        if (!restaurantId) {
            return res.status(403).json({ error: 'Restaurant ID is required.' });
        }
        const sessions = await Session.find({ restaurantId });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching sessions.' });
    }
};

// Get all active sessions for a restaurant
const activeSessions = async (req, res) => {
    try {
        const { restaurantId } = req.user;
        if (!restaurantId) {
            return res.status(403).json({ error: 'Restaurant ID is required.' });
        }
        const activeSessions = await Session.find({ restaurantId, status: 'Active' });
        res.status(200).json(activeSessions);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching active sessions.' });
    }
};

// Get all orders for a restaurant
const allOrders = async (req, res) => {
    try {
        const { restaurantId } = req.user;
        if (!restaurantId) {
            return res.status(403).json({ error: 'Restaurant ID is required.' });
        }
        const orders = await Order.find({ restaurantId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching orders.' });
    }
};

// Get all active orders for a restaurant
const activeOrders = async (req, res) => {
    try {
        const { restaurantId } = req.user;
        if (!restaurantId) {
            return res.status(403).json({ error: 'Restaurant ID is required.' });
        }
        const activeOrders = await Order.find({ restaurantId, status: 'Active' });
        res.status(200).json(activeOrders);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching active orders.' });
    }
};


// Update an order by admin
const editOrder = async (req, res) => {
    const { id } = req.params;
    const { action, item } = req.body;

    try {
        let order;

        switch (action) {
            case 'addItem':
                order = await Order.findByIdAndUpdate(
                    id,
                    { $push: { items: item }, updatedAt: new Date() },
                    { new: true }
                );
                break;

            case 'editItem':
                order = await Order.findOneAndUpdate(
                    { _id: id, 'items.itemId': item.itemId },
                    { $set: { 'items.$': item, updatedAt: new Date() } },
                    { new: true }
                );
                break;

            case 'removeItem':
                order = await Order.findByIdAndUpdate(
                    id,
                    { $pull: { items: { itemId: item.itemId } }, updatedAt: new Date() },
                    { new: true }
                );
                break;

            default:
                return res.status(400).json({ error: 'Invalid action specified.' });
        }

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the order.' });
    }
}


// Delete Order
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    // Find and delete the order by ID
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
    }

    // Delete the associated session using the sessionId from the order
    const session = await Session.findOneAndDelete({ _id: order.sessionId });
    if (!session) {
        return res.status(404).json({ error: 'Session not found.' });
    }

    res.status(200).json({ message: 'Order and associated session deleted successfully.' });
};


// Mark session as completed
const closeSession = async (req, res) => {
    const { id } = req.params;

    // Update the session's status to 'Closed'
    const session = await Session.findByIdAndUpdate(id, { status: 'Closed', updatedAt: new Date() }, { new: true });
    if (!session) {
        return res.status(404).json({ error: 'Session not found.' });
    }

    res.status(200).json(session);
};


module.exports = {
    signupAdmin, loginAdmin, getAdminProfile, updateAdminProfile,
    getRestaurant, updateRestaurant,
    addMenuItem, getMenu, getMenuItem, updateMenuItem, deleteMenuItem,
    generateQRCode,
    allSessions, activeSessions, closeSession,
    activeOrders, allOrders, editOrder, deleteOrder
};
