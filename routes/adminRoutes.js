const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/adminMiddleware');
const upload = require('../config/multer');
const { validateProduct } = require('../middleware/validationMiddleware');

// Apply Admin restriction to all /admin routes
router.use(isAdmin);

// Dashboard
router.get('/', (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', AdminController.getDashboard);

// Products
router.get('/products', AdminController.getProducts);
router.get('/products/add', AdminController.getAddProduct);
router.post('/products/add', upload.single('image_file'), validateProduct, AdminController.postAddProduct);
router.get('/products/edit/:id', AdminController.getEditProduct);
router.post('/products/edit/:id', upload.single('image_file'), validateProduct, AdminController.postEditProduct);
router.post('/products/delete/:id', AdminController.postDeleteProduct);

// Categories
router.get('/categories', AdminController.getCategories);
router.post('/categories/add', upload.single('image_file'), AdminController.postAddCategory);
router.post('/categories/delete/:id', AdminController.postDeleteCategory);

// Orders
router.get('/orders', AdminController.getOrders);
router.get('/orders/:id', AdminController.getOrderDetails);
router.post('/orders/:id/status', AdminController.postUpdateOrderStatus);

// Customers
router.get('/customers', AdminController.getCustomers);

// Inventory
router.get('/inventory', AdminController.getInventory);
router.post('/inventory/update-stock', AdminController.postUpdateStock);

module.exports = router;
