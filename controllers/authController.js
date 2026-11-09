const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const UserModel = require('../models/userModel');
const CartModel = require('../models/cartModel');

const AuthController = {
  getLogin(req, res) {
    const formData = req.flash('formData')[0] || {};
    res.render('auth/login', {
      pageTitle: 'Sign In — LUXE',
      formData
    });
  },

  async postLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findByEmail(email);

      if (!user) {
        req.flash('error_msg', 'Invalid email address or password.');
        req.flash('formData', { email });
        return res.redirect('/auth/login');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.flash('error_msg', 'Invalid email address or password.');
        req.flash('formData', { email });
        return res.redirect('/auth/login');
      }

      // Store in session (exclude password hash)
      req.session.user = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      // Merge guest cart items into user cart
      if (req.session.id) {
        try {
          await CartModel.mergeSessionCartToUser(req.session.id, user.user_id);
        } catch (mergeErr) {
          console.warn('[Cart Merge Warning]:', mergeErr.message);
        }
      }

      req.flash('success_msg', `Welcome back, ${user.name}!`);

      // Role-based or returnTo redirect
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      }

      const returnTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      return res.redirect(returnTo);
    } catch (err) {
      next(err);
    }
  },

  getRegister(req, res) {
    const formData = req.flash('formData')[0] || {};
    res.render('auth/register', {
      pageTitle: 'Create an Account — LUXE',
      formData
    });
  },

  async postRegister(req, res, next) {
    try {
      const { name, email, phone, password } = req.body;

      // Check duplicate email
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        req.flash('error_msg', 'An account with this email address already exists.');
        req.flash('formData', { name, email, phone });
        return res.redirect('/auth/register');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create customer account
      const userId = await UserModel.create({
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: 'customer'
      });

      // Automatically log the new user in
      req.session.user = {
        user_id: userId,
        name,
        email,
        role: 'customer'
      };

      // Merge guest cart items into new account
      if (req.session.id) {
        try {
          await CartModel.mergeSessionCartToUser(req.session.id, userId);
        } catch (mergeErr) {
          console.warn('[Cart Merge Warning]:', mergeErr.message);
        }
      }

      req.flash('success_msg', 'Registration successful! Welcome to LUXE.');
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  },

  postLogout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      res.redirect('/auth/login');
    });
  },

  getForgotPassword(req, res) {
    res.render('auth/forgot-password', {
      pageTitle: 'Reset Password — LUXE'
    });
  },

  async postForgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await UserModel.findByEmail(email);

      if (!user) {
        // Do not leak whether email exists for security
        req.flash('info_msg', 'If an account exists with that email, a password reset link has been dispatched.');
        return res.redirect('/auth/forgot-password');
      }

      // Generate secure reset token
      const token = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 3600000); // 1 hour

      await UserModel.setResetToken(email, token, expiry);

      // For local development and demonstration, surface the reset link
      const resetLink = `${req.protocol}://${req.get('host')}/auth/reset-password/${token}`;
      console.log('\n========================================');
      console.log('PASSWORD RESET TOKEN GENERATED:');
      console.log(`User: ${email}`);
      console.log(`Reset URL: ${resetLink}`);
      console.log('========================================\n');

      req.flash('success_msg', `Password reset token generated! Demo link: ${resetLink}`);
      res.redirect('/auth/forgot-password');
    } catch (err) {
      next(err);
    }
  },

  async getResetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const user = await UserModel.findByResetToken(token);

      if (!user) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.');
        return res.redirect('/auth/forgot-password');
      }

      res.render('auth/reset-password', {
        pageTitle: 'Set New Password — LUXE',
        token
      });
    } catch (err) {
      next(err);
    }
  },

  async postResetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const { password, confirmPassword } = req.body;

      if (!password || password.length < 6) {
        req.flash('error_msg', 'Password must be at least 6 characters long.');
        return res.redirect(`/auth/reset-password/${token}`);
      }

      if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match.');
        return res.redirect(`/auth/reset-password/${token}`);
      }

      const user = await UserModel.findByResetToken(token);
      if (!user) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.');
        return res.redirect('/auth/forgot-password');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await UserModel.updatePassword(user.user_id, hashedPassword);
      await UserModel.clearResetToken(user.user_id);

      req.flash('success_msg', 'Your password has been reset successfully. Please log in.');
      res.redirect('/auth/login');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AuthController;
