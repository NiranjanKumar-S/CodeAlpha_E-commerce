require('dotenv').config();
const session = require('express-session');

function createSessionMiddleware() {
  const store = new session.MemoryStore();

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
