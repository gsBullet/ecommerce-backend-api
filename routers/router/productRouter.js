// routes/productRoutes.js
const express = require("express");
const {
  addProduct,
  getProducts,
  updateProduct,
  getCategoriesForProduct,
  getProductById,
  deleteProduct,
} = require("../../controllers/ProductController");
const { uploadProductFiles } = require("../../middleware/uploadMiddeleware");

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
router.get("/product/get-products", getProducts);
router.get("/product/delete-product/:productId", deleteProduct);
router.get("/product/categories/options", getCategoriesForProduct);

module.exports = () => router;
