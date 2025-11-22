const CategoryModel = require("../models/CagegoryModel");

module.exports = {
  addCategory: async (req, res) => {
    try {
      const data = await CategoryModel.create(req.body);
      return res
        .status(200)
        .json({ message: "Category Added successfully", data });
    } catch (error) {
      console.log('error',error.code);
      
      if (error?.code == 11000) {
        return res.status(400).json({ message: "Category already exists" });
      }
      return res.status(400).json({ message: error.message });
    }
  },
  getAllCategory: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const data = await CategoryModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const count = await CategoryModel.countDocuments();

    return res.status(200).json({
      message: "Get Category List",
      data,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  },
  getAllCategoryForProduct: async (req, res) => {
    const data = await CategoryModel.find().sort({ createdAt: -1 }).exec();

    return res.status(200).json({
      message: "Get Category List",
      data,
    });
  },
  updateCategory: async (req, res) => {
    try {
      const data = await CategoryModel.findByIdAndUpdate(
        req.params.categoryId,
        { name: req.body?.name },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Category Updated successfully", data });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  updateCategoryByStatus: async (req, res) => {
    console.log(`req.body`, req.body);
    console.log(`req.body`, req.params.categoryId);
    const data = await CategoryModel.findByIdAndUpdate(
      req.params.categoryId,
      { status: req.body.status },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Category Updated successfully", data });
  },
  deleteCategory: async (req, res) => {
    const data = await CategoryModel.findByIdAndDelete(req.params.categoryId);
    return res
      .status(200)
      .json({ message: "Category Deleted successfully", data });
  },
};
