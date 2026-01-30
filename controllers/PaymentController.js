const GeneralUsersModel = require("../models/GeneralUsersModel");
const PaymentModel = require("../models/PaymentModel");
const ProductModel = require("../models/ProductModel");
const ErrorHandler = require("../utils/error");
const successHandler = require("../utils/success");

module.exports = {
  // Create Payment
  createPaymentManual: async (req, res) => {
    // console.log(req.body);

    // return res
    //   .status(200)
    //   .json({ message: "Payment created successfully", data: req.body });
    try {
      const {
        paymentMethod,
        phone,
        trxId,
        amount,
        customerId,
        products,
      } = req.body;
      const cartItems = Object.values(products);

      const productIds = [...new Set(cartItems.map((p) => p.productId))];

      const findProducts = await ProductModel.find({
        id: { $in: productIds },
      })
        .select("_id new_price id name category") 
        .lean();

      // merge price with cart data
      const finalData = cartItems.map((item) => {
        const product = findProducts.find((p) => p.id === item.productId);


        return {
          id: product?.id,
          name: product?.name || "",
          size: item.size,
          quantity: item.quantity,
          price: product?.new_price || 0,
          productId: product?._id,
          categoryId: product?.category ,
          total: product?.new_price * item.quantity,
        };
      });
      console.log(finalData);
      
  //  return;
      const customerProducts = finalData;
      
      const totalQuantity = customerProducts.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalAmount = customerProducts.reduce(
        (sum, item) => sum + item.total,
        0,
      );
      const payment = await GeneralUsersModel.findById(customerId);

      const deliveryFee =
        payment.addresses?.[0]?.deliveryMethod === "inside-dhaka" ? 60 : 120;

      const finalAmount = totalAmount + deliveryFee;
      console.log(finalAmount, parseInt(amount), deliveryFee,totalQuantity);
// return;
      if (finalAmount === parseInt(amount)) {
        const customer = await GeneralUsersModel.findById(customerId);
        const payment = await PaymentModel.create({
          paymentMethod,
          phone,
          trxId,
          customerId,
          payAmount: Number(amount),
          customerProducts,
          totalQuantity: totalQuantity,
          totalAmount: finalAmount,
          deliveryFee,
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
        { new: true },
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
