const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/checkoutController');
const { validateCheckout } = require('../middleware/validationMiddleware');

router.get('/', CheckoutController.getCheckout);
router.post('/process', validateCheckout, CheckoutController.postProcessOrder);

module.exports = router;
