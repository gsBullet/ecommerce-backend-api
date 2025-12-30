const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    paymentMethod: String,
    phone: String,
    trxId: String,
    amount: Number,
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
        id: {
          type: String,
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
        total: {
          type: Number,
        },
      },
    ],
    quantity: {
      type: Number,
    },
    payAmount: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "cancelled", "delivered", "return", "confirmed"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
