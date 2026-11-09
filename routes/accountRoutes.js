const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/accountController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, AccountController.getAccount);
router.post('/profile', isAuthenticated, AccountController.postUpdateProfile);
router.post('/password', isAuthenticated, AccountController.postChangePassword);
router.get('/wishlist', isAuthenticated, AccountController.getWishlist);
router.post('/wishlist/toggle/:productId', isAuthenticated, AccountController.postToggleWishlist);

module.exports = router;
