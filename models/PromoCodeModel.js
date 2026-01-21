// models/PromoCode.js
const mongoose = require("mongoose");

const PromoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      required: true,
      enum: ["flat", "percentage"],
      default: "flat",
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: null, // For percentage discounts, you can set a cap
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: null, // null means unlimited usage
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    }],
    applicableProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    }],
    customerSpecific: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "generalusers",
    }],
  },
  { timestamps: true }
);

// Add index for faster queries
PromoCodeSchema.index({ code: 1, isActive: 1 });
PromoCodeSchema.index({ validUntil: 1 });

module.exports = mongoose.model("promocodes", PromoCodeSchema);