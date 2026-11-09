const assert = require('assert');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const UserModel = require('../models/userModel');
const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const CartModel = require('../models/cartModel');
const CartService = require('../services/cartService');
const OrderService = require('../services/orderService');
const OrderModel = require('../models/orderModel');
const CouponModel = require('../models/couponModel');

async function runTestSuite() {
  console.log('==================================================');
  console.log('🧪 RUNNING COMPREHENSIVE E-COMMERCE TEST SUITE');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`• Testing: ${name}... `);
      await fn();
      console.log('✅ PASSED');
      passed++;
    } catch (err) {
      console.log('❌ FAILED');
      console.error('  Error:', err.message);
      failed++;
    }
  }

  // 1. Database & Categories
  await test('Categories Retrieval', async () => {
    const categories = await CategoryModel.getAll();
    assert(Array.isArray(categories), 'Categories must be an array');
    assert(categories.length >= 6, `Expected at least 6 categories, got ${categories.length}`);
    const audio = await CategoryModel.findBySlug('audio-sound');
    assert(audio, 'Expected audio-sound category to exist');
  });

  // 2. Products Catalog & Filtering
  await test('Products Retrieval & Category Filter', async () => {
    const products = await ProductModel.getFiltered({ limit: 20 });
    assert(products.length >= 10, 'Expected at least 10 products');
    
    const audioCat = await CategoryModel.findBySlug('audio-sound');
    const audioProducts = await ProductModel.getFiltered({ categoryId: audioCat.category_id });
    assert(audioProducts.length > 0, 'Expected products in audio-sound category');
    assert(audioProducts.every(p => p.category_id === audioCat.category_id), 'All returned products must match category');
  });

  await test('Products Price Filtering & Sorting', async () => {
    const lowToHigh = await ProductModel.getFiltered({ sort: 'price_asc', limit: 5 });
    for (let i = 0; i < lowToHigh.length - 1; i++) {
      const priceA = lowToHigh[i].discount_price || lowToHigh[i].price;
      const priceB = lowToHigh[i + 1].discount_price || lowToHigh[i + 1].price;
      assert(priceA <= priceB, `Expected ascending price order: ${priceA} <= ${priceB}`);
    }
  });

  // 3. User Authentication & Password Hashing
  await test('User Password Verification & Retrieval', async () => {
    const admin = await UserModel.findByEmail('admin@luxe.com');
    assert(admin, 'Admin account should exist');
    assert.strictEqual(admin.role, 'admin');

    const isValidPassword = await bcrypt.compare('Admin@123', admin.password);
    assert(isValidPassword, 'Admin password Admin@123 must match bcrypt hash');

    const customer = await UserModel.findByEmail('john@example.com');
    assert(customer, 'Customer john@example.com should exist');
    const isCustPassValid = await bcrypt.compare('Customer@123', customer.password);
    assert(isCustPassValid, 'Customer password must match hash');
  });

  await test('User Registration & Duplicate Protection', async () => {
    const testEmail = `testuser_${Date.now()}@example.com`;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Secret@123', salt);

    const newUserId = await UserModel.create({
      name: 'Test Customer',
      email: testEmail,
      phone: '+1-555-9988',
      password: hash,
      role: 'customer'
    });
    assert(newUserId, 'User should be assigned an ID');

    const fetched = await UserModel.findByEmail(testEmail);
    assert.strictEqual(fetched.name, 'Test Customer');
  });

  // 4. Shopping Cart Operations & Calculation
  await test('Shopping Cart Add, Update & Server Calculation', async () => {
    const sessionId = `test_session_${Date.now()}`;
    const cart = await CartModel.findOrCreateCart({ sessionId });
    assert(cart.cart_id, 'Cart should have an ID');

    // Add 2 units of product 1
    await CartModel.addItem(cart.cart_id, 1, 2);
    let summary = await CartService.getCartSummary({ sessionId });
    assert.strictEqual(summary.items.length, 1);
    assert.strictEqual(summary.itemCount, 2);

    // Apply Coupon WELCOME10 (10% off)
    summary = await CartService.getCartSummary({ sessionId, couponCode: 'WELCOME10' });
    assert(summary.appliedCoupon, 'Coupon WELCOME10 should be applied');
    assert(summary.discountAmount > 0, 'Discount amount must be calculated');
    const expectedSubtotal = summary.items[0].unitPrice * 2;
    assert.strictEqual(summary.subtotal, parseFloat(expectedSubtotal.toFixed(2)));

    // Cleanup test cart
    await CartModel.clearCart(cart.cart_id);
    const clearedSummary = await CartService.getCartSummary({ sessionId });
    assert.strictEqual(clearedSummary.items.length, 0);
  });

  // 5. Checkout & Order Processing Transaction
  await test('End-to-End Order Creation & Stock Reduction', async () => {
    const sessionId = `order_test_${Date.now()}`;
    const cart = await CartModel.findOrCreateCart({ sessionId });
    
    // Check initial stock for product 1
    const pBefore = await ProductModel.findById(1);
    const initialStock = pBefore.stock;

    // Add 1 unit
    await CartModel.addItem(cart.cart_id, 1, 1);

    const customerDetails = {
      fullName: 'Jane Test',
      phone: '+1-555-7766',
      email: 'jane.test@example.com',
      addressLine: '123 Test Street',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201'
    };

    const orderResult = await OrderService.processOrder({
      userId: null,
      sessionId,
      customerDetails,
      paymentMethod: 'cod',
      couponCode: 'WELCOME10'
    });

    assert(orderResult.success, 'Order processing must succeed');
    assert(orderResult.orderNumber.startsWith('ORD-'), 'Order number must have prefix ORD-');

    // Verify order was saved
    const order = await OrderModel.findByOrderNumber(orderResult.orderNumber);
    assert(order, 'Order must be saved in database');
    assert.strictEqual(order.order_status, 'Pending');
    assert.strictEqual(order.payment_method, 'cod');

    // Verify stock was reduced
    const pAfter = await ProductModel.findById(1);
    assert.strictEqual(pAfter.stock, initialStock - 1, 'Stock must decrease by ordered quantity');

    // Verify cart was cleared
    const cartItems = await CartModel.getCartItems(cart.cart_id);
    assert.strictEqual(cartItems.length, 0, 'Cart must be empty after order placement');
  });

  // 6. Admin Dashboard Stats & Order Status Progression
  await test('Admin Dashboard Statistics & Order Fulfillment', async () => {
    const stats = await OrderModel.getDashboardStats();
    assert(typeof stats.total_sales === 'number', 'Total sales must be numeric');
    assert(typeof stats.total_orders === 'number', 'Total orders must be numeric');
    assert(stats.total_orders > 0, 'Total orders should be > 0');

    const allOrders = await OrderModel.getAllOrders();
    assert(allOrders.length > 0, 'Should return orders list');
    const targetOrder = allOrders[0];

    // Update status to Confirmed then Shipped
    await OrderModel.updateOrderStatus(targetOrder.order_id, 'Shipped', 'paid');
    const updated = await OrderModel.findById(targetOrder.order_id);
    assert.strictEqual(updated.order_status, 'Shipped');
    assert.strictEqual(updated.payment_status, 'paid');
  });

  // 7. Express HTTP Server Integration
  await test('HTTP Server Startup & Comprehensive Route Health Checks', async () => {
    const http = require('http');
    const { app } = require('../server');
    
    await new Promise((resolve, reject) => {
      const server = http.createServer(app);
      server.listen(5099, async () => {
        try {
          const checkRoute = (urlPath) => new Promise((res, rej) => {
            http.get(`http://localhost:5099${urlPath}`, (resObj) => {
              res({ status: resObj.statusCode, location: resObj.headers.location });
            }).on('error', rej);
          });

          // 1. Home
          let res = await checkRoute('/');
          assert.strictEqual(res.status, 200, 'Home route should return 200');

          // 2. All Products
          res = await checkRoute('/products');
          assert.strictEqual(res.status, 200, 'Products route should return 200');

          // 3. Category Products
          res = await checkRoute('/products/category/audio-sound');
          assert.strictEqual(res.status, 200, 'Category route should return 200');

          // 4. Product Details
          res = await checkRoute('/products/luxe-sonic-studio-wireless-headphones');
          assert.strictEqual(res.status, 200, 'Product details route should return 200');

          // 5. Cart
          res = await checkRoute('/cart');
          assert.strictEqual(res.status, 200, 'Cart route should return 200');

          // 6. Auth Pages
          res = await checkRoute('/auth/login');
          assert.strictEqual(res.status, 200, 'Login page should return 200');

          res = await checkRoute('/auth/register');
          assert.strictEqual(res.status, 200, 'Register page should return 200');

          res = await checkRoute('/auth/forgot-password');
          assert.strictEqual(res.status, 200, 'Forgot password page should return 200');

          // 7. Static Pages
          res = await checkRoute('/about');
          assert.strictEqual(res.status, 200, 'About page should return 200');

          res = await checkRoute('/contact');
          assert.strictEqual(res.status, 200, 'Contact page should return 200');

          res = await checkRoute('/privacy');
          assert.strictEqual(res.status, 200, 'Privacy page should return 200');

          res = await checkRoute('/terms');
          assert.strictEqual(res.status, 200, 'Terms page should return 200');

          // 8. Unauthenticated Protected Route (should redirect to /auth/login)
          res = await checkRoute('/account');
          assert.strictEqual(res.status, 302, 'Unauthenticated /account should redirect 302');
          assert(res.location.includes('/auth/login'), 'Should redirect to /auth/login');

          res = await checkRoute('/admin/dashboard');
          assert.strictEqual(res.status, 302, 'Unauthenticated /admin should redirect 302');

          // 9. 404 Route
          res = await checkRoute('/non-existent-page-xyz');
          assert.strictEqual(res.status, 404, 'Invalid page should return 404');

          server.close(() => resolve());
        } catch (err) {
          server.close(() => reject(err));
        }
      });
    });
  });

  // 8. Admin Authenticated Routes & Privileges
  await test('Admin Authenticated Routes Verification', async () => {
    const http = require('http');
    const { app } = require('../server');
    
    // Simulate admin login session by registering a temporary test agent
    const adminUser = await UserModel.findByEmail('admin@luxe.com');
    assert(adminUser, 'Admin user must exist');

    await new Promise((resolve, reject) => {
      const server = http.createServer(app);
      server.listen(5098, async () => {
        try {
          // Perform login via POST /auth/login
          const postData = 'email=admin%40luxe.com&password=Admin%40123';
          const req = http.request({
            hostname: 'localhost',
            port: 5098,
            path: '/auth/login',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(postData)
            }
          }, (res) => {
            const cookie = res.headers['set-cookie'];
            assert(cookie, 'Login must yield session cookie');

            const cookieHeader = cookie.map(c => c.split(';')[0]).join('; ');

            // Now test admin protected endpoints with the cookie
            const getWithAuth = (p) => new Promise((r, rj) => {
              http.get({
                hostname: 'localhost',
                port: 5098,
                path: p,
                headers: { 'Cookie': cookieHeader }
              }, (resp) => {
                r(resp.statusCode);
              }).on('error', rj);
            });

            Promise.all([
              getWithAuth('/admin/dashboard'),
              getWithAuth('/admin/products'),
              getWithAuth('/admin/products/add'),
              getWithAuth('/admin/categories'),
              getWithAuth('/admin/orders'),
              getWithAuth('/admin/customers'),
              getWithAuth('/admin/inventory')
            ]).then((statuses) => {
              statuses.forEach((status, idx) => {
                assert.strictEqual(status, 200, `Admin route #${idx} must return 200 OK`);
              });
              server.close(() => resolve());
            }).catch(err => {
              server.close(() => reject(err));
            });
          });

          req.on('error', err => {
            server.close(() => reject(err));
          });
          req.write(postData);
          req.end();
        } catch (err) {
          server.close(() => reject(err));
        }
      });
    });
  });
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite();
