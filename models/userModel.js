const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Plase Enter Your Name"],
    maxLength: [30, "Name connot exceed 30 characters"],
    minLength: [4, "Name should be at least 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Plase Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be at least 8 characters"],
    select: false,
    /*
        Now,because of select now we can secure the password,that mean's when we'll find users(like User.find())..all data of users will come except password
        */
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// hashing the password before saving this in db
userSchema.pre("save", async function (next) {
  // now,we don't want hash the password again while user will update name and email,if password is changed only then we'll change it.
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compre Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
