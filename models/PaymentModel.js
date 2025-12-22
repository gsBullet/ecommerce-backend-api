const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    paymentMethod: String,
    phone: String,
    trxId: String,
    amount: Number,
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    customerProducts: [],
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
      enum: ["pending", "success", "failed"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
