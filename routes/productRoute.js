const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getAllReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// ALL Products Route
router.route("/products").get(getAllProducts);
// Add new product by admin
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
// Update or delete product route by admin
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
//  Get products details by id
router.route("/product/:id").get(getProductDetails);
// Add product review route
router.route("/product/review").put(isAuthenticatedUser, createProductReview);
// Get all reviews
// I had to use params here ..coz for some reason query is not working here.will find out later
router.route("/product/reviews/:productId").get(getAllReviews);
router.route("/product/reviews/:productId/:id").delete(deleteReview);

module.exports = router;
