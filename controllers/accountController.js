const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const WishlistModel = require('../models/wishlistModel');
const OrderModel = require('../models/orderModel');

const AccountController = {
  async getAccount(req, res, next) {
    try {
      const user = await UserModel.findById(req.session.user.user_id);
      const orders = await OrderModel.getOrdersByUser(user.user_id);
      const wishlist = await WishlistModel.getByUserId(user.user_id);

      res.render('account/index', {
        pageTitle: 'My Account — LUXE',
        user,
        recentOrders: orders.slice(0, 3),
        orderCount: orders.length,
        wishlistCount: wishlist.length
      });
    } catch (err) {
      next(err);
    }
  },

  async postUpdateProfile(req, res, next) {
    try {
      const { name, phone } = req.body;
      const userId = req.session.user.user_id;

      if (!name || name.trim().length < 2) {
        req.flash('error_msg', 'Name must be at least 2 characters.');
        return res.redirect('/account');
      }

      await UserModel.updateProfile(userId, { name: name.trim(), phone: phone ? phone.trim() : null });
      req.session.user.name = name.trim();

      req.flash('success_msg', 'Your profile information has been updated.');
      res.redirect('/account');
    } catch (err) {
      next(err);
    }
  },

  async postChangePassword(req, res, next) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const userId = req.session.user.user_id;

      if (newPassword.length < 6) {
        req.flash('error_msg', 'New password must be at least 6 characters long.');
        return res.redirect('/account');
      }

      if (newPassword !== confirmPassword) {
        req.flash('error_msg', 'New passwords do not match.');
        return res.redirect('/account');
      }

      const user = await UserModel.findById(userId);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        req.flash('error_msg', 'Current password is incorrect.');
        return res.redirect('/account');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await UserModel.updatePassword(userId, hashedPassword);

      req.flash('success_msg', 'Password changed successfully.');
      res.redirect('/account');
    } catch (err) {
      next(err);
    }
  },

  async getWishlist(req, res, next) {
    try {
      const items = await WishlistModel.getByUserId(req.session.user.user_id);
      res.render('account/wishlist', {
        pageTitle: 'My Wishlist — LUXE',
        items
      });
    } catch (err) {
      next(err);
    }
  },

  async postToggleWishlist(req, res, next) {
    try {
      const userId = req.session.user.user_id;
      const { productId } = req.params;

      const isListed = await WishlistModel.isWishlisted(userId, Number(productId));
      if (isListed) {
        await WishlistModel.remove(userId, Number(productId));
        req.flash('info_msg', 'Removed product from your wishlist.');
      } else {
        await WishlistModel.add(userId, Number(productId));
        req.flash('success_msg', 'Product saved to your wishlist!');
      }

      res.redirect('back');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AccountController;
