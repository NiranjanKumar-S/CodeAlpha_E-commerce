const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/success/:orderNumber', OrderController.getOrderSuccess);
router.get('/my-orders', isAuthenticated, OrderController.getMyOrders);
router.get('/:id', isAuthenticated, OrderController.getOrderDetails);

module.exports = router;
