const express = require("express");
const {
  addProduct,
  getProduct,
  updateProduct,
  updateProductByStatus,
  deleteProduct,
} = require("../../controllers/ProductController");
const upload = require("../../middleware/uploadMiddeleware");
const router = express.Router();

router.get("/get-product", getProduct);

router.post("/add-product", upload.single("image"), addProduct);

router.post(
  "/update-product/:productId",
  upload.single("image"),
  updateProduct
);

router.post("/update-status/:productId", updateProductByStatus);

router.get("/delete-product/:productId", deleteProduct);

module.exports = () => router;
