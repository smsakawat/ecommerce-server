const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // here we will check the through our generated token in cookies
  const { token } = req.cookies;
  //   console.log(token);
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, JWT_SECRET);
  //   here the id is wthat we provided while generating the token
  if (decodedData) {
    req.user = await User.findById(decodedData.id);
    next();
  }
});
