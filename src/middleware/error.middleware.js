const { AppError } = require("../utils/errors");

// Global error handler. Register this LAST in app.js, after all routes.
const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.error(`[${new Date().toISOString()}]`, err);
  } else {
    console.error(`[${new Date().toISOString()}]`, err.message);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
  }

  if (err && err.code === "P2002") {
    return res.status(409).json({
      success: false,
      error: `Duplicate: ${(err.meta && err.meta.target && err.meta.target.join(", ")) || "field"}`,
    });
  }

  if (err && err.code === "P2025") {
    return res.status(404).json({
      success: false,
      error: "Record not found",
    });
  }

  return res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};

module.exports = {
  errorHandler,
};
