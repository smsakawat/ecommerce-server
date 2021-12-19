const Product = require("../models/productModel");

// Get All Products
exports.getAllProduct = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
};

// Get Product Details
exports.getProductDetails = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
};
// Create A Product--Admin
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
};

// Update A Product--Admin
exports.updateProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);
  //   It's good to check first that the product is in DB or not..
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
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
};

// Delete A Product --Admin
exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
};
