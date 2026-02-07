const CategoryModel = require("../models/CagegoryModel");
const GeneralUsersModel = require("../models/GeneralUsersModel");
const ProductModel = require("../models/ProductModel");
const PromoCodeModel = require("../models/PromoCodeModel");
const ErrorHandler = require("../utils/error");
const successHandler = require("../utils/success");

module.exports = {
  createPromoCode: async (req, res) => {
    try {
      let {
        code,
        discountType,
        discountValue,
        maxDiscount,
        minPurchaseAmount,
        validFrom,
        validUntil,
        usageLimit,
        isActive,
        applicableProducts,
        applicableCategories,
        customerSpecific,
      } = req.body;

      // ---- CAST TYPES ----
      discountValue = Number(discountValue);
      maxDiscount =
        maxDiscount === "null" ||
        maxDiscount === undefined ||
        maxDiscount === ""
          ? null
          : Number(maxDiscount);
      minPurchaseAmount = Number(minPurchaseAmount || 0);
      usageLimit = usageLimit ? Number(usageLimit) : null;
      isActive = isActive === "true" || isActive === true;

      validFrom = new Date(validFrom);
      validUntil = new Date(validUntil);

      if (!Array.isArray(applicableProducts))
        applicableProducts = applicableProducts ? [applicableProducts] : [];

      if (!Array.isArray(applicableCategories))
        applicableCategories = applicableCategories
          ? [applicableCategories]
          : [];

      if (!Array.isArray(customerSpecific))
        customerSpecific = customerSpecific ? [customerSpecific] : [];

      // ---- CHECK DUPLICATE CODE ----
      const exists = await PromoCodeModel.findOne({ code });
      if (exists) {
        ErrorHandler({
          error: exists.code,
          message: "Promo code already exists",
          code: 400,
          res,
          req,
          req,
        });
      }
      // ---- CREATE ----
      const promo = await PromoCodeModel.create({
        code,
        discountType,
        discountValue,
        maxDiscount,
        minPurchaseAmount,
        validFrom,
        validUntil,
        usageLimit,
        isActive,
        applicableProducts,
        applicableCategories,
        customerSpecific,
      });
      if (promo) {
        successHandler({
          message: "Promo code created successfully",
          data: promo,
          code: 200,
          res,
          req,
        });
      } else {
        ErrorHandler({
          error: "Creation failed",
          message: "Failed to create promo code",
          code: 500,
          res,
          req,
        });
      }
    } catch (error) {
      ErrorHandler({
        error,
        message: error._message,
        code: 500,
        res,
        req,
      });
    }
  },
  updatePromoCode: async (req, res) => {
    const { promoCodeId } = req.params;
    try {
      let {
        code,
        discountType,
        discountValue,
        maxDiscount,
        minPurchaseAmount,
        validFrom,
        validUntil,
        usageLimit,
        isActive,
        applicableProducts,
        applicableCategories,
        customerSpecific,
      } = req.body;

      // ---- CAST TYPES ----
      discountValue = Number(discountValue);
      maxDiscount =
        maxDiscount === "null" ||
        maxDiscount === undefined ||
        maxDiscount === ""
          ? null
          : Number(maxDiscount);
      minPurchaseAmount = Number(minPurchaseAmount || 0);
      usageLimit = usageLimit ? Number(usageLimit) : null;
      isActive = isActive === "true" || isActive === true;

      validFrom = new Date(validFrom);
      validUntil = new Date(validUntil);

      if (!Array.isArray(applicableProducts))
        applicableProducts = applicableProducts ? [applicableProducts] : [];

      if (!Array.isArray(applicableCategories))
        applicableCategories = applicableCategories
          ? [applicableCategories]
          : [];

      if (!Array.isArray(customerSpecific))
        customerSpecific = customerSpecific ? [customerSpecific] : [];

      // ---- CHECK DUPLICATE CODE ----
      const exists = await PromoCodeModel.findOne({
        code,
        _id: { $ne: promoCodeId },
      });
      if (exists) {
        ErrorHandler({
          error: exists.code,
          message: "Promo code already exists",
          code: 400,
          res,
          req,
          req,
        });
      }
      // ---- UPDATE ----
      const promo = await PromoCodeModel.findByIdAndUpdate(
        promoCodeId,
        {
          code,
          discountType,
          discountValue,
          maxDiscount,
          minPurchaseAmount,
          validFrom,
          validUntil,
          usageLimit,
          isActive,
          applicableProducts,
          applicableCategories,
          customerSpecific,
        },
        { new: true },
      ).exec();

      if (promo) {
        successHandler({
          message: "Promo code updated successfully",
          data: promo,
          code: 200,
          res,
          req,
        });
      } else {
        ErrorHandler({
          error: "Update failed",
          message: "Failed to update promo code",
          code: 500,
          res,
          req,
        });
      }
    } catch (error) {
      ErrorHandler({
        error,
        message: error._message,
        code: 500,
        res,
        req,
      });
    }
  },
  deletePromoCode: async (req, res) => {
    const { promoCodeId } = req.params;
    try {
      const promo = await PromoCodeModel.findByIdAndDelete(promoCodeId).exec();
      if (promo) {
        successHandler({
          message: "Promo code deleted successfully",
          data: promo,
          code: 200,
          res,
          req,
        });
      } else {
        ErrorHandler({
          error: "Deletion failed",
          message: "Failed to delete promo code",
          code: 500,
          res,
          req,
        });
      }
    } catch (error) {
      ErrorHandler({
        error,
        message: error._message,
        code: 500,
        res,
        req,
      });
    }
  },
  updatePromoCodeStatus: async (req, res) => {
    const { promoCodeId } = req.params;
    const { isActive } = req.body;

    try {
      const promo = await PromoCodeModel.findByIdAndUpdate(
        promoCodeId,
        { isActive },
        { new: true },
      ).exec();

      if (promo) {
        successHandler({
          message: "Promo code status updated successfully",
          data: promo,
          code: 200,
          res,
          req,
        });
      } else {
        ErrorHandler({
          error: "Update failed",
          message: "Failed to update promo code status",
          code: 500,
          res,
          req,
        });
      }
    } catch (error) {
      ErrorHandler({
        error,
        message: error._message,
        code: 500,
        res,
        req,
      });
    }
  },
  getAllPromoCodeList: async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    const filter = {};
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: "i" } },
        // { discountType: { $regex: search, $options: "i" } },
        // { discountValue: { $regex: search, $options: "i" } },
        // { maxDiscount: { $regex: search, $options: "i" } },
        // { minPurchaseAmount: { $regex: search, $options: "i" } },
        // { validFrom: { $regex: search, $options: "i" } },
        // { validUntil: { $regex: search, $options: "i" } },
        // { usageLimit: { $regex: search, $options: "i" } },
        // { isActive: { $regex: search, $options: "i" } },
      ];
    }

    const promoCodes = await PromoCodeModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const totalPromoCodes = await PromoCodeModel.countDocuments(filter);
    successHandler({
      message: "Get Promo Code List",
      data: {
        promoCodes,
        totalPromoCodes,
        limit,
        totalPages: Math.ceil(totalPromoCodes / limit),
      },
      code: 200,
      res,
      req,
    });
  },
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
  applyAllPromoCodeForProducts: async (req, res) => {

    const { promo } = req.query;

    try {
      const matchPromo = await PromoCodeModel.find({code: promo}).exec();

     

      console.log(matchPromo);
      return ;
     
    } catch (error) {
      ErrorHandler({
        error,
        message: error._message,
        code: 500,
        res,
        req,
      });
    }
  },
};
