const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handling Database errors like cast error(it can be happen when someone will give a invalid id for requesting)
  if (err.name === "CastError") {
    const message = `Resource not found:${err.path}`;
    err = new ErrorHandler(message, 500);
  }
  res.status(err.statusCode).json({
    success: false,
    // we can also see the full error location with the help of stack..but now just i'll send the message
    // error: err.stack,
    message: err.message,
  });
};
