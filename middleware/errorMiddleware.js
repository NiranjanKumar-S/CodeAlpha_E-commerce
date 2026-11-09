function notFoundHandler(req, res, next) {
  res.status(404).render('errors/404', {
    pageTitle: 'Page Not Found',
    path: req.originalUrl
  });
}

function globalErrorHandler(err, req, res, next) {
  console.error('[Application Error]:', err);

  const statusCode = err.status || 500;
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(statusCode).render('errors/500', {
    pageTitle: 'Server Error',
    statusCode,
    message: isDev ? err.message : 'Something went wrong on our end. Please try again later.',
    stack: isDev ? err.stack : null
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
