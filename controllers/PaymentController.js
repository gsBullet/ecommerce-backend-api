const GeneralUsersModel = require("../models/GeneralUsersModel");
const PaymentModel = require("../models/PaymentModel");
const ProductModel = require("../models/ProductModel");
const ErrorHandler = require("../utils/error");
const successHandler = require("../utils/success");

module.exports = {
  // Create Payment
  createPaymentManual: async (req, res) => {
    // console.log(req.body);

    // return;
    try {
      const { paymentMethod, phone, trxId, amount, customerId, products } =
        req.body;
      const productCodes = Object.keys(products);
      const quantities = Object.values(products);
      const findProducts = await ProductModel.find({
        id: { $in: productCodes },
      })
        .select("_id new_price id")
        .lean();

      let customerProducts = findProducts.map((prod, index) => {
        return {
          productId: prod._id,
          id: prod.id,
          name: prod.name,
          quantity: Object.keys(products)
            .map((code, idx) => (code === prod.id ? quantities[idx] : 0))
            .reduce((a, b) => a + b, 0),
          price: prod.new_price,
          total:
            prod.new_price *
            Object.keys(products)
              .map((code, idx) => (code === prod.id ? quantities[idx] : 0))
              .reduce((a, b) => a + b, 0),
        };
      });
      const totalQuantity = customerProducts.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalAmount = customerProducts.reduce(
        (sum, item) => sum + item.total,
        0
      );
      const payment = await GeneralUsersModel.findById(customerId);

      const deliveryFee =
        payment.addresses?.[0]?.deliveryMethod === "inside-dhaka" ? 60 : 120;

      const finalAmount = totalAmount + deliveryFee;
      console.log(finalAmount, parseInt(amount), deliveryFee);

      if (finalAmount === parseInt(amount)) {
        const customer = await GeneralUsersModel.findById(customerId);
        const payment = await PaymentModel.create({
          paymentMethod,
          phone,
          trxId,
          customerId,
          payAmount: Number(amount),
          customerProducts,
          quantity: totalQuantity,
          totalAmount: finalAmount,
          address: customer.addresses?.[0]?.address,
        });

        successHandler({
          data: payment,
          message: "Thanks for your payment",
          code: 200,
          res,
          req,
        });
      } else {
        ErrorHandler({
          error: "Payment amount mismatch",
          message: "Payment amount mismatch",
          code: 400,
          res,
          req,
        });
      }
    } catch (err) {
      ErrorHandler({
        error: err,
        message: "Failed to process payment",
        code: 500,
        res,
        req,
      });
    }
  },
  // Get Payment by ID
  getPaymentById: async (req, res) => {
    try {
      const paymentId = req.params.id;
      const payment = await PaymentModel.findById(paymentId)
        .populate("customerId", "name email phone")
        .populate("productId", "name price")
        .populate("address", "street city state zip");

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      successHandler({
        data: payment,
        message: "Payment retrieved successfully",
        code: 200,
        res,
        req,
      });
    } catch (err) {
      ErrorHandler({
        error: err,
        message: "Failed to retrieve payment",
        code: 500,
        res,
        req,
      });
    }
  },

  // Update Payment Status
  updatePaymentStatus: async (req, res) => {
    try {
      const paymentId = req.params.id;
      const { status } = req.body;

      const payment = await PaymentModel.findByIdAndUpdate(
        paymentId,
        { status },
        { new: true }
      );
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      successHandler({
        data: payment,
        message: "Payment status updated successfully",
        code: 200,
        res,
        req,
      });
    } catch (err) {
      ErrorHandler({
        error: err,
        message: "Failed to update payment status",
        code: 500,
        res,
        req,
      });
    }
  },
};
