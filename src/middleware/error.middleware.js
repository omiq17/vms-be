/**
 * Global error handling middleware
 * Generic error handling without specific database error codes
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for server-side debugging
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Check if the error has a status code already assigned
  const statusCode = err.statusCode || 500;

  // Create a generic response object
  const errorResponse = {
    success: false,
    message: err.message || "Something went wrong",
  };

  // Add error details in development mode only
  if (process.env.NODE_ENV === "development") {
    errorResponse.details = err.stack;
  }

  // Send the response
  res.status(statusCode).json(errorResponse);
};

/**
 * Custom error handler factory
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Error} - Custom error object with statusCode
 */
const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = {
  errorHandler,
  createError,
};
