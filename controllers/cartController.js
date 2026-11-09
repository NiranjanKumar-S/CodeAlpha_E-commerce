const CartService = require('../services/cartService');
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');
const CouponModel = require('../models/couponModel');

const CartController = {
  async getCart(req, res, next) {
    try {
      const userId = req.session.user ? req.session.user.user_id : null;
      const sessionId = req.session.id;
      const couponCode = req.session.couponCode || null;

      const cartSummary = await CartService.getCartSummary({ userId, sessionId, couponCode });

      res.render('cart/index', {
        pageTitle: 'Your Shopping Cart — LUXE',
        cart: cartSummary
      });
    } catch (err) {
      next(err);
    }
  },

  async postAddToCart(req, res, next) {
    try {
      const { productId, quantity } = req.body;
      const parsedQty = Math.max(1, parseInt(quantity, 10) || 1);

      const product = await ProductModel.findById(productId);
      if (!product || product.status !== 'active') {
        req.flash('error_msg', 'This product is no longer available.');
        return res.redirect('back');
      }

      if (product.stock <= 0) {
        req.flash('error_msg', `Sorry, ${product.product_name} is out of stock.`);
        return res.redirect('back');
      }

      const userId = req.session.user ? req.session.user.user_id : null;
      const sessionId = req.session.id;
      const cart = await CartModel.findOrCreateCart({ userId, sessionId });

      // Check current cart item quantity
      const existing = await CartModel.findCartItem(cart.cart_id, product.product_id);
      const currentQty = existing ? existing.quantity : 0;

      if (currentQty + parsedQty > product.stock) {
        req.flash('error_msg', `Cannot add more than available stock (${product.stock} units in inventory).`);
        return res.redirect('back');
      }

      await CartModel.addItem(cart.cart_id, product.product_id, parsedQty);
      req.flash('success_msg', `Added "${product.product_name}" to your cart.`);

      if (req.body.buyNow) {
        return res.redirect('/checkout');
      }

      res.redirect('/cart');
    } catch (err) {
      next(err);
    }
  },

  async postUpdateQuantity(req, res, next) {
    try {
      const { cartItemId, quantity, productId } = req.body;
      const newQty = parseInt(quantity, 10);

      if (isNaN(newQty) || newQty < 1) {
        req.flash('error_msg', 'Invalid quantity specified.');
        return res.redirect('/cart');
      }

      const product = await ProductModel.findById(productId);
      if (product && newQty > product.stock) {
        req.flash('error_msg', `Only ${product.stock} units are currently available.`);
        return res.redirect('/cart');
      }

      await CartModel.updateItemQuantity(Number(cartItemId), newQty);
      req.flash('success_msg', 'Cart updated successfully.');
      res.redirect('/cart');
    } catch (err) {
      next(err);
    }
  },

  async postRemoveItem(req, res, next) {
    try {
      const { itemId } = req.params;
      await CartModel.removeItem(Number(itemId));
      req.flash('success_msg', 'Item removed from your cart.');
      res.redirect('/cart');
    } catch (err) {
      next(err);
    }
  },

  async postApplyCoupon(req, res, next) {
    try {
      const { couponCode } = req.body;
      if (!couponCode || couponCode.trim() === '') {
        req.flash('error_msg', 'Please enter a valid coupon code.');
        return res.redirect('/cart');
      }

      const coupon = await CouponModel.findByCode(couponCode.trim());
      if (!coupon) {
        req.flash('error_msg', 'Coupon code is invalid or has expired.');
        return res.redirect('/cart');
      }

      // Check minimum spend
      const userId = req.session.user ? req.session.user.user_id : null;
      const sessionId = req.session.id;
      const summary = await CartService.getCartSummary({ userId, sessionId });

      if (summary.subtotal < parseFloat(coupon.min_spend || 0)) {
        req.flash('error_msg', `Coupon requires a minimum order of $${parseFloat(coupon.min_spend).toFixed(2)}.`);
        return res.redirect('/cart');
      }

      req.session.couponCode = coupon.coupon_code;
      req.flash('success_msg', `Coupon "${coupon.coupon_code}" applied successfully!`);
      res.redirect('/cart');
    } catch (err) {
      next(err);
    }
  },

  postRemoveCoupon(req, res) {
    delete req.session.couponCode;
    req.flash('info_msg', 'Coupon removed.');
    res.redirect('/cart');
  }
};

module.exports = CartController;
