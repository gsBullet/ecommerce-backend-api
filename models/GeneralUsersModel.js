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
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    role: {
      type: String,
      default: "customer",
    },
    status: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    nid: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    activeUserStatus: {
      type: String,
      enum: ["star", "blocked", "pending", "verified"],
      default: "pending",
    },

    addresses: [
      {
        fullName: String,
        phone: String,
        email: String,
        address: String,
        city: String,
        state: String,
        postalCode: Number,
        deliveryMethod: String,
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
