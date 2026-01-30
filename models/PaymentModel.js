const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    paymentMethod: String,
    phone: String,
    trxId: String,
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "generalusers",
      required: true,
    },
    customerProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        categoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Categories",
        },
        id: String,
        price: Number,
        quantity: Number,
        total: Number,
        size:String,
      },
    ],
    totalAmount: Number, // before discount
    totalQuantity: Number,
    discountPercentage: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    payAmount: Number, // after discount
    address: String,
    deliveryFee: Number,
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "cancelled", "delivered", "returned", "confirmed"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
