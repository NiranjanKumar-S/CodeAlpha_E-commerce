const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error_msg', errors.array()[0].msg);
      req.flash('formData', req.body);
      return res.redirect('/auth/register');
    }
    next();
  }
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error_msg', errors.array()[0].msg);
      req.flash('formData', { email: req.body.email });
      return res.redirect('/auth/login');
    }
    next();
  }
];

const validateCheckout = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Delivery contact name is required.'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Contact phone number is required.'),
  body('addressLine')
    .trim()
    .notEmpty().withMessage('Delivery address is required.'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required.'),
  body('state')
    .trim()
    .notEmpty().withMessage('State is required.'),
  body('postalCode')
    .trim()
    .notEmpty().withMessage('Postal code is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error_msg', errors.array()[0].msg);
      return res.redirect('/checkout');
    }
    next();
  }
];

const validateProduct = [
  body('product_name')
    .trim()
    .notEmpty().withMessage('Product title is required.'),
  body('category_id')
    .notEmpty().withMessage('Category selection is required.')
    .isInt().withMessage('Invalid category ID.'),
  body('price')
    .notEmpty().withMessage('Price is required.')
    .isFloat({ min: 0 }).withMessage('Price must be a valid positive number.'),
  body('stock')
    .notEmpty().withMessage('Stock quantity is required.')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error_msg', errors.array()[0].msg);
      return res.redirect(req.originalUrl);
    }
    next();
  }
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateCheckout,
  validateProduct
};
