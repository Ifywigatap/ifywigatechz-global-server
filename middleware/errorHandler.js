export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Marks this as an expected, safe-to-expose error
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose CastError (Invalid ID)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found or invalid ID format';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      ok: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // Rate limit errors (429)
  if (statusCode === 429) {
    message = err.message || 'Too many requests. Please try again later.';
  }

  // PRODUCTION LEAK PREVENTION
  // Mask raw system errors from the client in production
  if (process.env.NODE_ENV === 'production' && !err.isOperational && statusCode === 500) {
    message = 'Something went wrong on our end. Please try again later.';
  }

  return res.status(statusCode).json({
    ok: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
