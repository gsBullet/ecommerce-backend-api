// routes/productRoutes.js
const express = require("express");
const {
  addProduct,
  getAllProducts,
  updateProduct,
  updateProductStatus,
  getProductById,
  deleteProduct,
} = require("../../controllers/ProductController");

const router = express.Router();

// Add product route with upload middleware
router.post("/product/add-product", addProduct);

// Update product route
router.post(
  "/product/update-product/:productId",
  updateProduct
);

// Other routes
router.get("/product/get-product/:productId", getProductById);
router.get("/product/all-products", getAllProducts);
router.get("/product/delete-product/:productId", deleteProduct);
router.post("/product/update-product-status/:productId", updateProductStatus);

module.exports = () => router;
