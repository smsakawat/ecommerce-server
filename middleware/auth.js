const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsyncErrors = require("./catchAsyncErrors");

// Checking if the user valid or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // here we will check the through our generated token in cookies
  const { token } = req.cookies;
  //   console.log(token);
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  //   here the id is wthat we provided while generating the token

  req.user = await User.findById(decodedData.id);

  //   console.log(req.user);

  next();
});

// Checking if the usre admin or not
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new ErrorHandler(
          `Role :${req.user.role} is  not allowed to access this resourse`
        )
      );
    }
    next();
  };
};
