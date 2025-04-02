/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Check if it's a PostgreSQL error
  if (err.code && err.code.startsWith("22P02")) {
    // Invalid text representation (likely ENUM value issue)
    return res.status(400).json({
      success: false,
      message: "Invalid input value for database enum type",
      details: err.message,
    });
  }

  if (err.code && err.code === "23505") {
    // Unique constraint violation
    return res.status(409).json({
      success: false,
      message: "Resource already exists",
      details: err.message,
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = {
  errorHandler,
};
