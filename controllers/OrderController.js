const PaymentModel = require("../models/PaymentModel");
const successHandler = require("../utils/success");
const ErrorHandler = require("../utils/error");
const GeneralUsersModel = require("../models/GeneralUsersModel");

module.exports = {
  getPendingOrders: async (req, res) => {
    try {
      // Logic to get pending orders
      const orders = await PaymentModel.find({ status: "pending" })
        .sort({ createdAt: -1 })
        .populate("customerId")
        .populate({
          path: "customerProducts.productId",
          populate: {
            path: "category",
            select: "name",
          },
        });

      successHandler({
        data: orders,
        message: "Orders retrieved successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to retrieve orders",
        code: 500,
        res,
        req,
      });
    }
  },
  getCancelledOrders: async (req, res) => {
    // Logic to get cancelled orders
    try {
      const orders = await PaymentModel.find({ status: "cancelled" });
      successHandler({
        data: orders,
        message: "Orders retrieved successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to retrieve orders",
        code: 500,
        res,
        req,
      });
    }
  },
  getDeliveredOrders: async (req, res) => {
    // Logic to get delivered orders
    try {
      const orders = await PaymentModel.find({ status: "delivered" });
      successHandler({
        data: orders,
        message: "Orders retrieved successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to retrieve orders",
        code: 500,
        res,
        req,
      });
    }
  },
  getReturnOrders: async (req, res) => {
    try {
      const orders = await PaymentModel.find({ status: "return" });
      successHandler({
        data: orders,
        message: "Orders retrieved successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to retrieve orders",
        code: 500,
        res,
        req,
      });
    }
  },

  getCompleteOrders: async (req, res) => {
    // Logic to get complete orders
    try {
      const orders = await PaymentModel.find({ status: "confirmed" });
      successHandler({
        data: orders,
        message: "Orders retrieved successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to retrieve orders",
        code: 500,
        res,
        req,
      });
    }
  },
  getOrderDetails: async (req, res) => {
    // Logic to get order details
    try {
      const orderId = req.query.orderId;
      const order = await PaymentModel.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      successHandler({
        data: order,
        message: "Order retrieved successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to retrieve order",
        code: 500,
        res,
        req,
      });
    }
  },
  updateOrderStatus: async (req, res) => {
    // Logic to update order status
    try {
      const orderId = req.params.orderId;
      const { status } = req.body;

      const order = await PaymentModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      } else {
        successHandler({
          data: order,
          message: "Order status updated successfully",
          code: 200,
          res,
          req,
        });
      }
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to update order status",
        code: 500,
        res,
        req,
      });
    }
  },
  makeCompletedOrder: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const order = await PaymentModel.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      order.status = "confirmed";
      await order.save();
      successHandler({
        data: order,
        message: "Order status updated successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to update order status",
        code: 500,
        res,
        req,
      });
    }
  },
  makeCancellingOrder: async (req, res) => {
    try {
      const orderId = req.params?.orderId;
      const order = await PaymentModel.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      order.status = "cancelled";
      await order.save();
      successHandler({
        data: order,
        message: "Order status updated successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to update order status",
        code: 500,
        res,
        req,
      });
    }
  },
};
