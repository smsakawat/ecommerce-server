const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
/*
 we used catchAsynErrors func as middleware rather than using try,catch in every controllers..
*/
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// Get All Products
exports.getAllProduct = catchAsyncErrors(async (req, res) => {
  const productPerPage = 6;
  // here the search is case-insensitive,but filter is case sensitive
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(productPerPage);

    // total products
    const productCount = await Product.countDocuments();

  // so here we'll get the products based on query,if there's no query we'll get all products.But i need to clear this topic must
  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productCount
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
// Create A Product--Admin
exports.createProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

// Update A Product--Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  //   It's good to check first that the product is in DB or not..
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// Delete A Product --Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});
