const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle Mongodb Wrong Id error
  if (err.name === "CastError") {
    const message = `Resource not found:${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Handle Mongoose Duplicate Key Error like (email for register in our case)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Hanlding Wrong token error
  if (err.name === "JsonwebTokenError") {
    const message = "Json Web Token is Ivalid,Try again",
      err = new ErrorHanlder(message, 400);
  }

  // Token Expire Error
  if (err.name === "TokenExpireError") {
    const message = "Json Web Token is Expired,Try again",
      err = new ErrorHanlder(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    // we can also see the full error location with the help of stack..but now just i'll send the message
    // error: err.stack,
    message: err.message,
  });
};
