const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userAuth = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request object
        req.user = decoded.id; // Exclude the password field

        console.log(req.user);

        if (!req.user) {
            return res.status(401).json({ error: 'User not found. Authorization denied.' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error in userAuth middleware:', error.message);
        return res.status(401).json({ error: 'Token is not valid.' });
    }
};

module.exports = userAuth;
