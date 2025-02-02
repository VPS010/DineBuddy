const { Menu } = require('../models/Menu')
const { User } = require('../models/User')
const { Restaurant } = require('../models/Restaurant')
const { Session } = require('../models/Sessions')
const { Order } = require('../models/Orders')

const userGenerateToken = require('../utils/userGenerateToken'); // Import the token generation function

// Signup user
const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered.' });
        }

        // Create a new user
        const user = new User({
            name,
            email,
            password,
        });

        // Save user to the database
        await user.save();

        // Generate JWT token
        const token = userGenerateToken(user._id);

        // Send response with token
        res.status(201).json({
            message: 'User created successfully.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token, // Return the JWT token
        });
    } catch (error) {
        console.error('Error in signupUser:', error.message);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
};




// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Find user by email
        const user = await User.findOne({ email: email, password: password });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Generate JWT token
        const token = userGenerateToken({ id: user._id });

        // Send response with token
        res.status(200).json({
            message: 'Login successful.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token, // Return the JWT token
        });
    } catch (error) {
        console.error('Error in loginUser:', error.message);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
};




const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({
            message: 'User profile fetched successfully.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error in getUserProfile:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching the user profile.' });
    }
};

const getMenu = async (req, res) => {
    try {
        const { restaurantId } = req.params; // Access restaurantId from URL parameter
        const { table } = req.query; // Access table from query parameter

        if (!restaurantId) {
            return res.status(400).json({ error: 'Restaurant ID is required.' });
        }

        // Fetch menu items
        const menuItems = await Menu.find({ restaurantid: restaurantId });

        if (!menuItems.length) {
            return res.status(404).json({ error: 'No menu items found.' });
        }

        // Fetch restaurant information, including geoFence coordinates
        const restaurant = await Restaurant.findById(restaurantId, 'name address contact geoFence');

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }

        // Return menu along with restaurant information
        res.status(200).json({
            message: 'Menu items fetched successfully.',
            table: table,
            menu: menuItems,
            restaurant: {
                name: restaurant.name,
                address: restaurant.address,
                contact: restaurant.contact,
                geoFence: restaurant.geoFence?.coordinates || null, // Handle cases where geoFence might not exist
            },
        });
    } catch (error) {
        console.error('Error in getMenu:', error.message);
        return res.status(500).json({ error: 'An error occurred while fetching the menu.' });
    }
};


const getMenuItemById = async (req, res) => {
    try {
        const { menuItemId } = req.params; // Access the menu item ID from URL parameter

        if (!menuItemId) {
            return res.status(400).json({ error: 'Menu item ID is required.' });
        }

        // Fetch the specific menu item by its ID
        const menuItem = await Menu.findById(menuItemId);

        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found.' });
        }

        // Return the menu item details
        res.status(200).json({
            message: 'Menu item fetched successfully.',
            menuItem,
        });
    } catch (error) {
        console.error('Error in getMenuItemById:', error.message);
        return res.status(500).json({ error: 'An error occurred while fetching the menu item.' });
    }
};





// Create or get active session for a table
const createSession = async (req, res) => {
    const { tableNumber, restaurantId } = req.body;

    try {
        // Check if there's an active order process for the table
        let session = await Session.findOne({ tableNumber, restaurantId, status: 'Active' });

        if (session) {
            // Inform the customer if an active session already exists
            return res.status(200).json({
                message: 'An order process is already active for your table. Please continue with your order.',
                tableStatus: {
                    tableNumber: session.tableNumber,
                    status: 'Active',
                    startedAt: session.createdAt,
                    sessionId: session._id
                }
            });
        }

        // Create a new session if no active session exists
        session = new Session({
            tableNumber,
            restaurantId,
            status: 'Active'
            // Remove the circular reference that was causing the error
        });
        await session.save();

        res.status(201).json({
            message: 'Welcome! Your table is now ready for ordering. Please proceed to place your order.',
            tableStatus: {
                tableNumber: session.tableNumber,
                status: 'Active',
                sessionId: session._id,
                startedAt: session.createdAt,
            }
        });
    } catch (error) {
        console.error('Error creating table activity:', error);
        res.status(500).json({
            error: 'An error occurred while starting your table activity. Please try again.',
            details: error.message
        });
    }
};


// Add items to an order
// Backend: userController.js - Updated createOrder function
// Server-side (createOrder controller)
const createOrder = async (req, res) => {
    const { tableNumber, restaurantId, sessionId, items } = req.body;

    try {
        // Validate the session exists and is active
        const session = await Session.findOne({
            _id: sessionId,
            tableNumber,
            restaurantId,
            status: 'Active',
        });

        if (!session) {
            return res.status(404).json({
                error: 'No active session found for this table. Please start an order.',
            });
        }

        // Validate items format before processing
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: 'Invalid items format or empty items array',
            });
        }

        // Enrich items with menu details and ensure valid prices
        const enrichedItems = await Promise.all(
            items.map(async (item) => {
                const menuItem = await Menu.findById(item.itemId);
                if (!menuItem) {
                    throw new Error(`Menu item with ID ${item.itemId} not found`);
                }

                // Ensure price is a valid number
                if (typeof menuItem.price !== 'number' || isNaN(menuItem.price)) {
                    throw new Error(`Invalid price for menu item ${menuItem.name}`);
                }

                return {
                    itemId: menuItem._id,
                    name: menuItem.name,
                    price: menuItem.price,
                    image: menuItem.image || null,
                    spiceLevel: item.spiceLevel || menuItem.spiceLevel,
                    quantity: parseInt(item.quantity) || 1, // Ensure quantity is a number
                };
            })
        );

        // Calculate total amount with validation
        const totalAmount = enrichedItems.reduce((total, item) => {
            const itemTotal = item.price * item.quantity;
            if (isNaN(itemTotal)) {
                throw new Error(`Invalid total calculation for item ${item.name}`);
            }
            return total + itemTotal;
        }, 0);

        // Validate total amount
        if (isNaN(totalAmount)) {
            throw new Error('Total amount calculation resulted in NaN');
        }

        // Find an existing order or create a new one
        let order = await Order.findOne({
            sessionId: session._id,
            restaurantId,
            tableNumber,
            status: 'Active',
        });

        // Inside createOrder function, replace the consolidation section with:
        // Inside createOrder function:

        if (order) {
            // Merge existing items with new items
            const existingItems = order.items || [];
            const mergedItems = [...existingItems, ...enrichedItems];

            // Validate and normalize items before consolidation
            const validMergedItems = mergedItems.filter(item => {
                if (!item.itemId) {
                    console.warn('Skipping item due to missing itemId:', item);
                    return false;
                }
                // Ensure price and quantity are valid numbers
                if (typeof item.price !== 'number' || isNaN(item.price)) {
                    console.warn('Skipping item due to invalid price:', item);
                    return false;
                }
                if (!item.quantity || isNaN(parseInt(item.quantity))) {
                    console.warn('Skipping item due to invalid quantity:', item);
                    return false;
                }
                return true;
            });

            // Consolidate quantities for items with the same itemId and spiceLevel
            const consolidatedItems = validMergedItems.reduce((acc, item) => {
                try {
                    const existingItem = acc.find(i =>
                        i.itemId?.toString() === item.itemId?.toString() &&
                        i.spiceLevel === item.spiceLevel
                    );

                    if (existingItem) {
                        existingItem.quantity = parseInt(existingItem.quantity) + parseInt(item.quantity);
                        existingItem.price = Number(existingItem.price);
                    } else {
                        acc.push({
                            ...item,
                            quantity: parseInt(item.quantity),
                            price: Number(item.price)
                        });
                    }
                    return acc;
                } catch (err) {
                    console.error('Error processing item:', item, err);
                    return acc;
                }
            }, []);

            // Recalculate total amount after consolidation with explicit number handling
            const newTotalAmount = consolidatedItems.reduce((total, item) => {
                const itemPrice = Number(item.price);
                const itemQuantity = parseInt(item.quantity);

                if (isNaN(itemPrice) || isNaN(itemQuantity)) {
                    console.warn('Invalid price or quantity for item:', item);
                    return total;
                }

                const itemTotal = itemPrice * itemQuantity;
                return total + itemTotal;
            }, 0);

            // Validate the final total amount before saving
            if (isNaN(newTotalAmount)) {
                throw new Error('Invalid total amount calculation');
            }

            order.items = consolidatedItems;
            order.totalAmount = newTotalAmount;
            order.updatedAt = new Date();
            await order.save();

            return res.status(200).json({
                message: 'Order updated successfully',
                order,
            });
        } else {
            // Create a new order
            order = new Order({
                tableNumber,
                sessionId: session._id,
                restaurantId,
                items: enrichedItems,
                totalAmount,
                status: 'Active',
            });

            await order.save();

            return res.status(201).json({
                message: 'New order created successfully',
                order,
            });
        }
    } catch (error) {
        console.error('Error in createOrder:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation error',
                details: Object.values(error.errors).map((err) => err.message),
            });
        }

        res.status(500).json({
            error: 'An error occurred while processing the order',
            details: error.message,
        });
    }
};


const deleteOrderItem = async (req, res) => {
    const { tableNumber, itemId } = req.params;

    try {
        // Find the order by table number and validate it exists
        const order = await Order.findOne({
            tableNumber: tableNumber,
            status: 'Active'
        });

        if (!order) {
            return res.status(404).json({
                error: 'Active order not found for this table'
            });
        }

        // Find the item in the order
        const itemIndex = order.items.findIndex(
            item => item._id.toString() === itemId
        );
        console.log('itemIndex:', itemId);
        console.log('itemIndex:', itemIndex);

        if (itemIndex === -1) {
            return res.status(404).json({
                error: 'Item not found in order'
            });
        }

        // Calculate the amount to subtract from total
        const itemToRemove = order.items[itemIndex];
        const amountToSubtract = itemToRemove.price * itemToRemove.quantity;

        // Remove the item and update total amount
        order.items.splice(itemIndex, 1);
        order.totalAmount = Math.max(0, order.totalAmount - amountToSubtract);
        order.updatedAt = new Date();


        await order.save();

        return res.status(200).json({
            message: 'Item removed successfully',
            order
        });

    } catch (error) {
        console.error('Error in deleteOrderItem:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid item ID format'
            });
        }

        return res.status(500).json({
            error: 'An error occurred while deleting the item',
            details: error.message
        });
    }
};




const getOrder = async (req, res) => {
    const { restaurantId, tableNumber } = req.params;

    try {
        // Find the active session
        const session = await Session.findOne({
            tableNumber,
            restaurantId,
            status: 'Active'
        });

        if (!session) {
            return res.status(404).json({
                error: 'No active session found for this table. Please start an order.'
            });
        }

        // Get the active order with populated item details
        const order = await Order.findOne({
            sessionId: session._id,
            restaurantId,
            status: 'Active'
        });

        if (!order) {
            return res.status(404).json({
                error: 'No order found for this table. Please place an order.'
            });
        }

        res.status(200).json({
            message: 'Order retrieved successfully.',
            order: {
                items: order.items,
                sessionId: session._id,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                status: order.status
            }
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            error: 'An error occurred while retrieving the order.',
            details: error.message
        });
    }
};


module.exports = {
    signupUser, loginUser, getUserProfile,
    getMenu, getMenuItemById,
    createSession, deleteOrderItem, createOrder, getOrder
};



