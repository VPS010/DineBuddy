const express = require('express');
const userAuth = require('../middlewares/userauth')
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

router.post('/signup', signupUser);
router.post('/signin', loginUser);
router.get('/profile', userAuth, getUserProfile);

router.get('/menu', getMenu);  //user scans Qn get redirectd to restro menu and query of restroId and tableNo. as https://yourdomain.com/menu?restaurantId=${restaurantId}&table=${tableNumber}

// router.post('/order', placeOrder);
// router.get('/order/:id', getOrder);
// router.put('/order/:id', updateOrder);
// router.get('/order/history', getOrderHistory);
// router.post('/feedback', submitFeedback);

module.exports = router;
