const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
// here we'll generate the link with token for resetting the password
router.route("/password/forgot").post(forgotPassword);
// and here we'll reset the password(within 15 mins),because after 15 min the token will be expired
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
