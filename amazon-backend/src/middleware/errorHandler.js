const AppError = require('../utils/AppError');

/**
 * Global Error Handler Middleware
 * Catches all errors and returns clean JSON responses
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development: Send full error details
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }

  // Production: Send clean error messages
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Programming or unknown errors: don't leak details
  console.error('ERROR 💥:', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong on the server'
  });
};

module.exports = errorHandler;
