const CategoryModel = require("../models/CagegoryModel");

module.exports = {
  addCategory: async (req, res) => {
    const data = await CategoryModel.create(req.body);
    return res
      .status(200)
      .json({ message: "Category Added successfully", data });
  },
  getCategory: () => {
    const data = CategoryModel.find();
    return res.status(200).json({ message: "Get Category List", data });
  },
  updateCategory: (req, res) => {
    const data = CategoryModel.findByIdAndUpdate(
      req.params.categoryId,
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Category Updated successfully", data });
  },
  updateCategoryByStatus: (req, res) => {
    const data = CategoryModel.findByIdAndUpdate(
      req.params.categoryId,
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Category Updated successfully", data });
  },
  deleteCategory: (req, res) => {
    const data = CategoryModel.findByIdAndDelete(req.params.categoryId);
    return res
      .status(200)
      .json({ message: "Category Deleted successfully", data });
  },
};
