const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\S+$/],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Shipping addresses (users can save multiple)
    addresses: [
      {
        fullName: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pincode: String,
        country: {
          type: String,
          default: "Bangladesh",
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Optional: for future features
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("generalusers", userSchema);
