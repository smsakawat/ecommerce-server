const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
/*
 we used catchAsynErrors func as middleware rather than using try,catch in every controllers..
*/
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const productsPerPage = 8;

  // I have a little bit confustion here...i need to clear this topic later must
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(productsPerPage);

  products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    filteredProductsCount,
    productsPerPage,
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
  // here i setting the user in product,so that later we can find out we added product
  req.body.user = req.user._id;
  // console.log(req.body.user);
  const product = await Product.create(req.body);
  res.status(201).json({
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
    return next(new ErrorHandler("Product not found", 400));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// Get all product reviews
exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
  // so here i used params rather than query
  console.log(req.query);
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
//Create or Update a review and set average ratings
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
  };
  const product = await Product.findById(productId);

  // Chcecking if the user reviewed this product is past or not..if reviewed then we will update it..otherwise will add a new one.
  const isReviewed = product.reviews.some(
    (review) => review.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.rating = Number(rating);
        review.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Get the new average of product
  let avg = 0;
  product.reviews.forEach((review) => {
    avg += review.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(201).json({
    success: true,
    message: "Thanks for your valuable review",
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  // so here will recieve two two id in params,one is productId to find the product and the another is the review id we want to delete
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // updata reviews,ratings and numOfReviews for deleting review from product
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.params.id.toString()
  );

  let avg = 0;
  reviews.forEach((review) => {
    avg += review.rating;
  });
  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;

  //  updata product after deleting review
  await Product.findByIdAndUpdate(
    req.params.productId,
    {
      ratings,
      reviews,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review deleted succesfully",
  });
});
