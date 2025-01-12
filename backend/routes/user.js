const express = require('express');
const {
    signupUser,
    loginUser,
    getUserProfile,
    getMenu,
    placeOrder,
    getOrder,
    updateOrder,
    getOrderHistory,
    submitFeedback
} = require('../controllers/userController');

const router = express.Router();

// router.post('/signup', signupUser);
// router.post('/login', loginUser);
// router.get('/profile', getUserProfile);
// router.get('/menu', getMenu);
// router.post('/order', placeOrder);
// router.get('/order/:id', getOrder);
// router.put('/order/:id', updateOrder);
// router.get('/order/history', getOrderHistory);
// router.post('/feedback', submitFeedback);

module.exports = router;
