class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    //so we know that we can use any methods from the class, which we inherit
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandler;
