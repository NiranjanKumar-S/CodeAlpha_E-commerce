const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

router.get('/', CartController.getCart);
router.post('/add', CartController.postAddToCart);
router.post('/update', CartController.postUpdateQuantity);
router.post('/remove/:itemId', CartController.postRemoveItem);
router.post('/apply-coupon', CartController.postApplyCoupon);
router.post('/remove-coupon', CartController.postRemoveCoupon);

module.exports = router;
