const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user and restaurant ID from the decoded token to the request object
       
        req.user = {
            id: decoded.id,
            restaurantId: decoded.restaurantId || null, // Include restaurantId if present
        };
       console.log(req.user);
       console.log(req.user.restaurantId);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = protect;
