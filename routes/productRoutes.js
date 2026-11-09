const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

router.get('/', ProductController.getAllProducts);
router.get('/category/:slug', ProductController.getByCategory);
router.get('/:slug', ProductController.getProductDetails);
router.post('/:productId/reviews', ProductController.postReview);

module.exports = router;
