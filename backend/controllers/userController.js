const { Menu } = require('../models/Menu')
const { User } = require('../models/User')

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
            return res.status(400).json({ error: 'Restaurant ID and Table are required.' });
        }

        const menuItems = await Menu.find({ restaurantid: restaurantId });

        if (!menuItems.length) {
            return res.status(404).json({ error: 'No menu items found.' });
        }

        res.status(200).json({
            message: 'Menu items fetched successfully.',
            table: table,
            menu: menuItems,
        });
    } catch (error) {
        console.error('Error in getMenu:', error.message);
        return res.status(500).json({ error: 'An error occurred while fetching the menu.' });
    }
};


module.exports = {
    signupUser, loginUser, getUserProfile,
    getMenu
};
