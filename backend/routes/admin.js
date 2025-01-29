const express = require('express');
const protect = require('../middlewares/auth');
const { signupAdmin,
    loginAdmin,
    getAdminProfile,
    updateAdminProfile,
    getRestaurant,
    updateRestaurant,
    menuCategories,
    addMenuItem,
    getMenu,
    getMenuItem,
    updateMenuItem,
    deleteMenuItem,
    generateQRCode,
    createAdminOrder,
    getOrders,
    getKitchenOrders,
    updateOrderItemStatus,
    getMenuCategories,
    deleteCategory,
    getAnalytics,
    activeOrders,
    allSessions,
    activeSessions,
    editOrder,
    deleteOrder,
    orderStatus,
    orderPay,
} = require('../controllers/adminController');

const router = express.Router();

router.post('/signup', signupAdmin);
router.post('/signin', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.put('/profile', protect, updateAdminProfile);

router.post('/qr/generate', protect, generateQRCode);

// Restaurant Routes
router.put('/restaurant', protect, updateRestaurant);      // Update restaurant info
router.get('/restaurant', protect, getRestaurant);         // Get restaurant info

router.post('/menu/categories',protect, menuCategories);
router.get('/menu/categories', protect, getMenuCategories);
router.delete('/menu/categories/:category', protect, deleteCategory);


router.post('/menu', protect, addMenuItem);
router.get('/menu', protect, getMenu);
router.get('/menu/:id', protect, getMenuItem);
router.put('/menu/:id', protect, updateMenuItem);
router.delete('/menu/:id', protect, deleteMenuItem);



router.get('/orders', protect, getOrders);
router.post('/orders', protect, createAdminOrder);
router.patch('/order/:id', protect, editOrder);
router.delete('/order/:id', protect, deleteOrder);
router.put('/order/complete/:orderId', protect, orderStatus);
router.put('/order/pay/:orderId', protect, orderPay);


router.get('/orders/kitchen', protect, getKitchenOrders);
router.put('/orders/:orderId/:itemId', protect, updateOrderItemStatus);


// router.get('/orders', getOrders);
// router.get('/order/:id', getOrder);
// router.put('/order/:id', updateOrderStatus);

// router.get('/analytics/:type', getAnalytics); // :type -> orders, sales, feedback

module.exports = router;
