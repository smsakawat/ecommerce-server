const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/jwtToken");

// Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is temporary",
      url: "here will be a url of avatar",
    },
  });
  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Plase Enter Email & Password"), 401);
  }
  // here i cannot directly pass passworn in findOne,because i selected:false for this..so i need to use "method" also
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  const isPasswordMatched = user.comparePassword();

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Succesfully",
  });
});

// Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // console.log(user);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get Password Token
  const resetToken = user.getResetPasswordToken();
  // now we have to save resetPassword token and resetPasswordExpires in this user,so we have to save this user
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl}\n\nif you have not requested this email,then please ignore it`;

  try {
    //  let's send email by node mailer to user with resetPasswordUrl
    await sendEmail({
      res,
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });

    // res.status(200).json({
    //   success: true,
    //   message: `Email sent to ${user.email} successfully`,
    // });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
  }
});
