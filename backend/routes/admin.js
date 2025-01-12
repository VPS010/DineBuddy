const express = require('express');
const protect = require('../middlewares/auth');
const { signupAdmin,
    loginAdmin,
    getAdminProfile,
    updateAdminProfile,
    addRestaurant,
    getRestaurant,
    updateRestaurant,
    addMenuItem,
    getMenu,
    getMenuItem,
    updateMenuItem,
    deleteMenuItem,
    generateQRCode,
    getOrders,
    getOrder,
    updateOrderStatus,
    getAnalytics
} = require('../controllers/adminController');

const router = express.Router();

router.post('/signup', signupAdmin);
router.post('/login', loginAdmin);
router.get('/profile',protect, getAdminProfile);
router.put('/profile',protect, updateAdminProfile);


// Restaurant Routes
router.post('/restaurant/register', protect, addRestaurant); // Restaurant signup
router.get('/restaurant', protect, getRestaurant);         // Get restaurant info
router.put('/restaurant', protect, updateRestaurant);      // Update restaurant info

router.post('/menu', addMenuItem);
// router.get('/menu', getMenu);
// router.get('/menu/:id', getMenuItem);
// router.put('/menu/:id', updateMenuItem);
// router.delete('/menu/:id', deleteMenuItem);

// router.post('/qr/generate', generateQRCode);

// router.get('/orders', getOrders);
// router.get('/order/:id', getOrder);
// router.put('/order/:id', updateOrderStatus);

// router.get('/analytics/:type', getAnalytics); // :type -> orders, sales, feedback

module.exports = router;
