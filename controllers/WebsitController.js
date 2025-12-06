const ProductModel = require("../models/ProductModel");

module.exports = {
  getWebsiteProducts: async (req, res) => {
    const products = await ProductModel.find({}).populate("category", "name");

    return res.status(200).json({
      success: true,
      message: "Get Product List",
      data: products,
    });
  },
  getNewProducts: async (req, res) => {
    const newProducts = await ProductModel.find({}).sort({ createdAt: -1 }).limit(6);

    return res.status(200).json({
      success: true,
      message: "Get Product List",
      data: newProducts,
    });
  },
};
