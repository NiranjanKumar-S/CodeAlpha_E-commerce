function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash('error_msg', 'Please sign in to access this page.');
  req.session.returnTo = req.originalUrl;
  return res.redirect('/auth/login');
}

function isGuest(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }
  return next();
}

module.exports = {
  isAuthenticated,
  isGuest
};
