const express = require("express");
const {
  addCategory,
  getCategory,
  updateCategory,
  updateCategoryByStatus,
  deleteCategory,
} = require("../../controllers/CategoryController");
const router = express.Router();

router.get("/get-category", getCategory);

router.post("/add-category", addCategory);

// router.get("/get-category/:categoryId", (req, res) => {
//   return res.status(200).json({ message: "Get Category By Id" });
// });

router.post("/update-category/:categoryId", updateCategory);

router.get("/update-status/:categoryId", updateCategoryByStatus);

router.get("/delete-category/:categoryId", deleteCategory);

module.exports = () => router;
