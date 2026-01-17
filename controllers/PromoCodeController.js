const CategoryModel = require("../models/CagegoryModel");
const GeneralUsersModel = require("../models/GeneralUsersModel");
const ProductModel = require("../models/ProductModel");

module.exports = {
  createPromoCode: async (req, res) => {
    try {
    } catch (error) {}
  },
  updatePromoCode: async (req, res) => {},
  deletePromoCode: async (req, res) => {},
  getAllPromoCodeList: async (req, res) => {},
  getAllCategoryForPromoCode: async (req, res) => {
    const data = await CategoryModel.find({ status: true })
      .sort({ updatedAt: -1 })
      .select("_id name")
      .exec();
    return res.status(200).json({
      message: "Get Category List",
      data,
    });
  },
  getAllProductsForPromoCode: async (req, res) => {
    const data = await ProductModel.find({ status: true })
      .sort({ updatedAt: -1 })
      .select("_id name id new_price")
      .exec();
    return res.status(200).json({
      message: "Get product List",
      data,
    });
  },
  getAllUsersForDiscount: async (req, res) => {
    try {
      const search = req.query.customerSearch?.trim();

      // 🔴 No search → send null
    //   if (!search) {
    //     return res.status(200).json({
    //       message: "No search keyword provided",
    //       data: null,
    //     });
    //   }

      const data = await GeneralUsersModel.find({
        activeUserStatus: { $ne: "blocked" }, // 🔴 exclude blocked
        $or: [
          { name: { $regex: search, $options: "i" } },
          { activeUserStatus: { $regex: search, $options: "i" } },
        ],
      })
        .sort({ updatedAt: -1 })
        .select("_id name activeUserStatus")
        .exec();

      return res.status(200).json({
        message: "Get user List",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },
};
