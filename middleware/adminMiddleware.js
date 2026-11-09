function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.flash('error_msg', 'Access restricted to authorized administrators only.');
  return res.redirect('/auth/login');
}

module.exports = {
  isAdmin
};
