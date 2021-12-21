const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// Register user route
router.route("/register").post(registerUser);
// Login user route
router.route("/login").post(loginUser);
// Logout user route
router.route("/logout").get(logoutUser);
// here we'll generate the link with token for resetting the password
router.route("/password/forgot").post(forgotPassword);
// and here we'll reset the password(within 15 mins),because after 15 min the token will be expired
router.route("/password/reset/:token").put(resetPassword);
// Get user details route
router.route("/me").get(isAuthenticatedUser, getUserDetails);
// Update Password route
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
// User profile update route
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
// Get all users route for admin
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
// Single user details,Update user role & Delete user routes by admin
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
