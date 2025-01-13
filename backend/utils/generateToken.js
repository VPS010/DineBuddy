const jwt = require('jsonwebtoken');

const generateToken = (id, restaurantId) => {
    return jwt.sign(
        { id, restaurantId: restaurantId }, // Include both admin ID and restaurant ID in the payload
        process.env.JWT_SECRET,
        { expiresIn: '30d' } // Token expires in 30 days
    );
};

module.exports = generateToken;
