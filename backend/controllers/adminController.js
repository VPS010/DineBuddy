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
        const { name, address, contact, description, businessHours, tax, geoFence } = req.body;

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
        if (tax) restaurant.tax = tax;

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
                tax: restaurant.tax,
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
        const restaurant = await Restaurant.findOne({ adminId: req.user.id });//from Auth middleware

        // If the restaurant is not found, return a 404 error
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }

        // Return the restaurant details
        res.status(200).json({
            message: 'Restaurant details retrieved successfully.',
            restaurant: {
                id: restaurant._id,
                tax: restaurant.tax,
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

const menuCategories = async (req, res) => {
    const restaurantId = req.user.restaurantId; // Get restaurant ID from authenticated user
    const { categories } = req.body; // Array of categories

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return res.status(400).json({ error: "Invalid categories. Provide a non-empty array of category names." });
    }

    try {
        // Find the restaurant by ID
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Filter out categories that are already present in the restaurant's menu
        const newCategories = categories.filter(category => !restaurant.categories.includes(category));

        // If there are any new categories, add them
        if (newCategories.length > 0) {
            restaurant.categories.push(...newCategories);
            // Save the updated restaurant document
            await restaurant.save();
        }

        res.status(200).json({
            message: newCategories.length > 0 ? "Categories added successfully" : "No new categories to add",
            categories: restaurant.categories,
        });
    } catch (error) {
        console.error("Error adding categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}




// Route to get categories for a restaurant sorted alphabetically
const getMenuCategories = async (req, res) => {
    const restaurantId = req.user.restaurantId; // Get restaurant ID from authenticated user

    try {
        // Find the restaurant by ID
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Sort the categories alphabetically
        const sortedCategories = restaurant.categories.sort((a, b) =>
            a.localeCompare(b)
        );

        // Return the sorted categories
        res.status(200).json({
            categories: sortedCategories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


// Delete category route handler
const deleteCategory = async (req, res) => {
    const restaurantId = req.user.restaurantId;
    const { category } = req.params; // Category to delete

    try {
        // Find the restaurant
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Check if category exists
        if (!restaurant.categories.includes(category)) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Check if there are menu items using this category
        const menuItemsWithCategory = await Menu.find({
            restaurantid: restaurantId,
            category: category
        });

        if (menuItemsWithCategory.length > 0) {
            return res.status(400).json({
                error: "Cannot delete category. It is being used by menu items."
            });
        }

        // Remove the category
        restaurant.categories = restaurant.categories.filter(c => c !== category);
        await restaurant.save();

        res.status(200).json({
            message: "Category deleted successfully",
            categories: restaurant.categories
        });

    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


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



// Create or get active session for a table
const getOrCreateSession = async (tableNumber, restaurantId) => {
    let session = await Session.findOne({ tableNumber, restaurantId, status: 'Active' });
    if (!session) {
        session = new Session({ tableNumber, restaurantId, status: 'Active' });
        await session.save();
    }
    return session;
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


// Admin Creates Order (Dine-In or Parcel)
const createAdminOrder = async (req, res) => {
    const { tableNumber, items, type, customerName } = req.body;
    const restaurantId = req.user.restaurantId; // Extract restaurant ID from admin auth

    try {
        if (!['Dine-In', 'Parcel'].includes(type)) {
            return res.status(400).json({ error: 'Invalid order type. Must be Dine-In or Parcel.' });
        }

        let session = null;
        if (type === 'Dine-In') {
            if (!tableNumber) {
                return res.status(400).json({ error: 'Dine-In orders require a tableNumber.' });
            }
            session = await getOrCreateSession(tableNumber, restaurantId);
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Invalid items format or empty items array.' });
        }

        const enrichedItems = await Promise.all(
            items.map(async (item) => {
                const menuItem = await Menu.findById(item.itemId);
                if (!menuItem) throw new Error(`Menu item with ID ${item.itemId} not found`);
                return {
                    itemId: menuItem._id,
                    name: menuItem.name,
                    price: menuItem.price,
                    image: menuItem.image || null,
                    spiceLevel: item.spiceLevel || menuItem.spiceLevel,
                    quantity: parseInt(item.quantity) || 1,
                };
            })
        );

        const totalAmount = enrichedItems.reduce((total, item) => total + item.price * item.quantity, 0);

        const order = new Order({
            tableNumber: type === 'Dine-In' ? tableNumber : null,
            sessionId: type === 'Dine-In' ? session._id : null,
            restaurantId,
            customerName: customerName || 'Valued Customer',
            items: enrichedItems,
            totalAmount,
            type,
            status: 'Active',
            paymentStatus: 'Unpaid',
        });

        await order.save();

        res.status(201).json({
            message: 'Order created successfully',
            order,
            session: session ? { sessionId: session._id, tableNumber: session.tableNumber } : null,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
};



// Get all orders for a restaurant for Order Management
const getOrders = async (req, res) => {
    try {
        // Extract filters from the query parameters
        const { startDate, endDate } = req.query;

        // Initialize the query object
        const query = {
            restaurantId: req.user.restaurantId,
        };

        // Apply date range filter if provided
        if (startDate) {
            query.createdAt = { $gte: new Date(startDate) };

            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        // Fetch orders from the database
        const orders = await Order.find(query)
            .sort({ createdAt: -1 }); // Sort by most recent orders

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};


// Get all orders for a restaurant to Kitchen Management
const getKitchenOrders = async (req, res) => {
    try {
        // Query for active orders from the restaurant
        const query = {
            restaurantId: req.user.restaurantId,
            status: 'Active'
        };

        // Fetch orders from the database
        const orders = await Order.find(query)
            .sort({ createdAt: -1 }); // Sort by most recent orders

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};


//Kitchen Screen: Update order item status
const updateOrderItemStatus = async (req, res) => {
    try {
        const { orderId, itemId } = req.params;
        const { status } = req.body;
        const restaurantId = req.user.restaurantId;

        // Validate status
        const validStatuses = ['Pending', 'In Progress', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        // Find the order and verify restaurant ownership
        const order = await Order.findOne({
            _id: orderId,
            restaurantId: restaurantId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or unauthorized access'
            });
        }

        // Find the specific item
        const itemIndex = order.items.findIndex(
            item => item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in order'
            });
        }

        const currentStatus = order.items[itemIndex].status;
        const newStatus = status;

        // Define valid status transitions
        const validTransitions = {
            'Pending': ['In Progress', 'Completed'],
            'In Progress': ['Completed'],
            'Completed': []
        };

        // Check if the status transition is valid
        if (!validTransitions[currentStatus].includes(newStatus) && currentStatus !== newStatus) {
            return res.status(400).json({
                success: false,
                message: `Cannot change status from ${currentStatus} to ${newStatus}. Valid next statuses are: ${validTransitions[currentStatus].join(', ') || 'none'}`
            });
        }

        // Update the item status
        order.items[itemIndex].status = status;
        order.updatedAt = new Date();

        // Save the updated order
        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Item status updated successfully',
            data: order.items[itemIndex]
        });

    } catch (error) {
        console.error('Error updating order item status:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


const editOrder = async (req, res) => {
    const { id } = req.params;
    const { action, item, items, customerName } = req.body;

    try {
        if (!action) {
            return res.status(400).json({ error: 'Action is required.' });
        }

        let order;
        const updateTime = { updatedAt: new Date() };

        switch (action) {
            case 'bulkEdit':
                // Validate items array for bulk edit
                if (!Array.isArray(items) || items.length === 0) {
                    return res.status(400).json({ error: 'Valid items array is required for bulk edit.' });
                }

                // Get the existing order to preserve item statuses
                const existingOrder = await Order.findById(id);
                if (!existingOrder) {
                    return res.status(404).json({ error: 'Order not found.' });
                }

                // Create a map of existing items with their statuses and IDs
                const existingItems = new Map(
                    existingOrder.items.map(item => [
                        item.itemId.toString(),
                        { status: item.status, _id: item._id }
                    ])
                );

                // Enrich items with preserved status and _id where applicable
                const validatedItems = items.map(item => {
                    const existing = existingItems.get(item.itemId.toString());
                    return {
                        itemId: item.itemId,
                        name: item.name,
                        price: item.price,
                        image: item.image || null,
                        spiceLevel: item.spiceLevel,
                        quantity: item.quantity,
                        // Preserve existing status or default to 'Pending'
                        status: existing ? existing.status : 'Pending',
                        // Preserve existing _id or let MongoDB generate new one
                        _id: existing ? existing._id : undefined
                    };
                });

                const bulkEditUpdate = {
                    items: validatedItems,
                    ...updateTime,
                    totalAmount: validatedItems.reduce(
                        (sum, item) => sum + (item.price * item.quantity),
                        0
                    )
                };

                if (customerName !== undefined) {
                    bulkEditUpdate.customerName = customerName;
                }

                order = await Order.findByIdAndUpdate(
                    id,
                    bulkEditUpdate,
                    { new: true }
                );
                break;

            case 'addItem':
                if (!item) {
                    return res.status(400).json({ error: 'Item data is required for adding an item.' });
                }

                // Add default status for new item
                const newItem = {
                    ...item,
                    status: 'Pending'
                };

                order = await Order.findByIdAndUpdate(
                    id,
                    {
                        $push: { items: newItem },
                        ...updateTime,
                        $inc: { totalAmount: item.price * item.quantity }
                    },
                    { new: true }
                );
                break;

            case 'editItem':
                if (!item || !item.itemId) {
                    return res.status(400).json({ error: 'ItemId is required to edit an item.' });
                }

                // Get existing item to preserve status
                const existingItem = await Order.findOne(
                    { _id: id, 'items.itemId': item.itemId },
                    { 'items.$': 1 }
                );

                if (!existingItem || !existingItem.items[0]) {
                    return res.status(404).json({ error: 'Item not found in order.' });
                }

                // Preserve existing status and _id
                const updatedItem = {
                    ...item,
                    status: existingItem.items[0].status,
                    _id: existingItem.items[0]._id
                };

                order = await Order.findOneAndUpdate(
                    { _id: id, 'items.itemId': item.itemId },
                    {
                        $set: { 'items.$': updatedItem },
                        ...updateTime
                    },
                    { new: true }
                );

                // Recalculate total amount
                if (order) {
                    order.totalAmount = order.items.reduce(
                        (sum, item) => sum + (item.price * item.quantity),
                        0
                    );
                    await order.save();
                }
                break;

            case 'removeItem':
                if (!item || !item.itemId) {
                    return res.status(400).json({ error: 'ItemId is required to remove an item.' });
                }

                order = await Order.findByIdAndUpdate(
                    id,
                    {
                        $pull: { items: { itemId: item.itemId } },
                        ...updateTime
                    },
                    { new: true }
                );

                // Recalculate total amount after removal
                if (order) {
                    order.totalAmount = order.items.reduce(
                        (sum, item) => sum + (item.price * item.quantity),
                        0
                    );
                    await order.save();
                }
                break;

            default:
                return res.status(400).json({ error: `Invalid action: ${action}` });
        }

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Error editing order:', error);
        res.status(500).json({ error: 'An error occurred while updating the order.' });
    }
};


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

const orderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order to ensure it exists
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Directly set the order status to 'Closed'
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                status: 'Closed',
                updatedAt: new Date()
            },
            { new: true }
        );

        // Update the associated session status to 'Closed' if session exists
        if (order.sessionId) {
            await Session.findByIdAndUpdate(
                { _id: order.sessionId },
                {
                    status: 'Closed',
                    updatedAt: new Date()
                }
            );
        }

        // Send response with the updated order
        res.status(200).json({
            success: true,
            order: updatedOrder,
            message: 'Order and associated session status updated to Closed'
        });
    } catch (error) {
        console.error('Error in orderStatus:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating the order status'
        });
    }
};

const orderPay = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by ID
        console.log('Order ID:', orderId);
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order is already paid
        if (order.paymentStatus === 'Paid') {
            return res.status(400).json({ message: 'Order is already marked as Paid' });
        }

        // Update payment status to 'Paid', order status to 'Closed'
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                paymentStatus: 'Paid',
                status: 'Closed',
                updatedAt: new Date()
            },
            { new: true }
        );

        // Only update session if it's a dine-in order
        if (order.type === 'Dine-In' && order.sessionId) {
            const updatedSession = await Session.findByIdAndUpdate(
                order.sessionId,
                {
                    status: 'Closed',
                    updatedAt: new Date()
                },
                { new: true }
            );

            // If session not found for dine-in order, log warning but don't fail
            if (!updatedSession) {
                console.warn(`Session not found for dine-in order ${orderId}`);
            }
        }

        res.status(200).json({
            success: true,
            message: `Order successfully marked as Paid and status set to 'Closed'`,
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error in orderPay:', error);
        res.status(500).json({ error: 'Error updating order status' });
    }
};

module.exports = {
    signupAdmin, loginAdmin, getAdminProfile, updateAdminProfile,
    getRestaurant, updateRestaurant,
    menuCategories, getMenuCategories, deleteCategory,
    addMenuItem, getMenu, getMenuItem, updateMenuItem, deleteMenuItem,
    generateQRCode,
    getOrCreateSession, allSessions, activeSessions,
    createAdminOrder, getOrders, editOrder, deleteOrder,
    getKitchenOrders, updateOrderItemStatus,
    orderStatus, orderPay
};
