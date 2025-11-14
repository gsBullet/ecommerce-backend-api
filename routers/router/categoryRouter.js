const express = require("express");
const {
  addCategory,
  getAllCategory,
  updateCategory,
  updateCategoryByStatus,
  deleteCategory,
} = require("../../controllers/CategoryController");
const router = express.Router();

router.get("/category/all-category", getAllCategory);

router.post("/category/add-category", addCategory);

// router.get("/get-category/:categoryId", (req, res) => {
//   return res.status(200).json({ message: "Get Category By Id" });
// });

router.post("/category/update-category/:categoryId", updateCategory);

router.post("/category/update-category-status/:categoryId", updateCategoryByStatus);

router.get("/category/delete-category/:categoryId", deleteCategory);

module.exports = () => router;
  