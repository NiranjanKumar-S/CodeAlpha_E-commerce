require('dotenv').config();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

function createSessionMiddleware(db) {
  let store;

  if (db.isMySQL()) {
    const options = {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce_db',
      clearExpired: true,
      checkExpirationInterval: 900000,
      expiration: 86400000 * 7 // 7 days
    };
    try {
      store = new MySQLStore(options);
      console.log('✅ Session store connected to MySQL');
    } catch (err) {
      console.warn('⚠️  Could not initialize MySQL session store, using MemoryStore fallback:', err.message);
      store = new session.MemoryStore();
    }
  } else {
    store = new session.MemoryStore();
  }

  return session({
    key: 'luxe_sid',
    secret: process.env.SESSION_SECRET || 'luxe_default_session_secret_change_in_production',
    store: store,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
  });
}

module.exports = createSessionMiddleware;
