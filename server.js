require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const flash = require('connect-flash');

const db = require('./config/database');
const createSessionMiddleware = require('./config/session');
const CartService = require('./services/cartService');

// Import Routes
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const accountRoutes = require('./routes/accountRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import Error Middleware
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorMiddleware');

const app = express();

// 1. Security Headers with Helmet (configured for CDNs & Unsplash images)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
        connectSrc: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// 2. HTTP Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 3. Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. Static Files
app.use(express.static(path.join(__dirname, 'public')));

// 5. Template Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 6. Session & Flash Middleware
app.use(createSessionMiddleware(db));
app.use(flash());

// 7. Global Context Middleware for all Views
app.use(async (req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.info_msg = req.flash('info_msg');
  res.locals.currentPath = req.path;

  // Compute live cart count for header
  try {
    const userId = req.session.user ? req.session.user.user_id : null;
    const sessionId = req.session.id;
    const summary = await CartService.getCartSummary({ userId, sessionId });
    res.locals.cartItemCount = summary.itemCount || 0;
  } catch (err) {
    res.locals.cartItemCount = 0;
  }

  next();
});

// 8. Mount Application Routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/orders', orderRoutes);
app.use('/account', accountRoutes);
app.use('/admin', adminRoutes);

// 9. Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// 10. Start Server
const PORT = process.env.PORT || 5000;

async function startServer() {
  await db.testConnection();

  const server = app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(` LUXE E-Commerce Engine Live on Port ${PORT}`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================\n`);
  });

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
