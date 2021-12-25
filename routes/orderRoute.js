const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// New Order Route
router.route("/order/new").post(isAuthenticatedUser, newOrder);
// Get Single Order Route
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
// Get my orders route for user
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
// Get all orders route for admin
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
// update and delete order routes for admin
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
