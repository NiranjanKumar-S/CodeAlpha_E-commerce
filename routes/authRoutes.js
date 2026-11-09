const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const AuthController = require('../controllers/authController');
const { isGuest, isAuthenticated } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
});

router.get('/login', isGuest, AuthController.getLogin);
router.post('/login', isGuest, authLimiter, validateLogin, AuthController.postLogin);

router.get('/register', isGuest, AuthController.getRegister);
router.post('/register', isGuest, authLimiter, validateRegistration, AuthController.postRegister);

router.post('/logout', isAuthenticated, AuthController.postLogout);
router.get('/logout', (req, res) => res.redirect('/auth/login'));

router.get('/forgot-password', isGuest, AuthController.getForgotPassword);
router.post('/forgot-password', isGuest, authLimiter, AuthController.postForgotPassword);

router.get('/reset-password/:token', isGuest, AuthController.getResetPassword);
router.post('/reset-password/:token', isGuest, authLimiter, AuthController.postResetPassword);

module.exports = router;
