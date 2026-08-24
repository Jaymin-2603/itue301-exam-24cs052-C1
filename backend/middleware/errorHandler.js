// errorHandler.js
// Global error-handling middleware — must be registered LAST in server.js.
// Returns structured JSON instead of raw Express error stack.

function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);

  // Handle Mongoose ValidationError cleanly
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: "Validation failed", errors: messages });
  }

  // Handle duplicate key error (e.g., unique email)
  if (err.code === 11000) {
    return res.status(400).json({ message: "Duplicate value. Record already exists." });
  }

  // Default: 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;
