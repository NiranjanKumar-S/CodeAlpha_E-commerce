const CartService = require('../services/cartService');
const OrderService = require('../services/orderService');
const db = require('../config/database');

const CheckoutController = {
  async getCheckout(req, res, next) {
    try {
      const userId = req.session.user ? req.session.user.user_id : null;
      const sessionId = req.session.id;
      const couponCode = req.session.couponCode || null;

      const cartSummary = await CartService.getCartSummary({ userId, sessionId, couponCode });

      if (!cartSummary.items || cartSummary.items.length === 0) {
        req.flash('info_msg', 'Your shopping cart is currently empty. Add products before proceeding to checkout.');
        return res.redirect('/cart');
      }

      // Prepopulate address if user has saved one
      let savedAddress = null;
      if (userId) {
        const [addresses] = await db.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY address_id DESC LIMIT 1', [userId]);
        if (addresses.length > 0) savedAddress = addresses[0];
      }

      res.render('checkout/index', {
        pageTitle: 'Checkout & Secure Payment — LUXE',
        cart: cartSummary,
        user: req.session.user || null,
        savedAddress
      });
    } catch (err) {
      next(err);
    }
  },

  async postProcessOrder(req, res, next) {
    try {
      const userId = req.session.user ? req.session.user.user_id : null;
      const sessionId = req.session.id;
      const couponCode = req.session.couponCode || null;

      const { fullName, phone, email, addressLine, city, state, postalCode, paymentMethod } = req.body;

      const customerDetails = {
        fullName,
        phone,
        email,
        addressLine,
        city,
        state,
        postalCode
      };

      const result = await OrderService.processOrder({
        userId,
        sessionId,
        customerDetails,
        paymentMethod: paymentMethod === 'online' ? 'online' : 'cod',
        couponCode
      });

      // Clear coupon from session
      delete req.session.couponCode;

      req.flash('success_msg', 'Thank you! Your order has been placed successfully.');
      return res.redirect(`/orders/success/${result.orderNumber}`);
    } catch (err) {
      req.flash('error_msg', err.message || 'An error occurred while processing your order.');
      return res.redirect('/checkout');
    }
  }
};

module.exports = CheckoutController;
