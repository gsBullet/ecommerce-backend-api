const PaymentModel = require("../models/PaymentModel");
const successHandler = require("../utils/success");
const ErrorHandler = require("../utils/error");
const GeneralUsersModel = require("../models/GeneralUsersModel");

module.exports = {
  getPendingOrders: async (req, res) => {
    const limit = req.query.limit || 10;
    const currentPage = req.query.currentPage || 1;
    const searchTerm = req.query.searchTerm || "";
    const paymentMethod = req.query.paymentMethod || "";
    const dateByOrders = req.query.dateByOrders || null;

    // console.log(`dateByOrders`, dateByOrders);

    try {
      // Logic to get pending orders
      const filter = { status: "pending" };

      if (searchTerm) {
        filter.$or = [
          { trxId: { $regex: searchTerm, $options: "i" } },
          { phone: { $regex: searchTerm, $options: "i" } },
        ];
      }

      if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
      }

      if (dateByOrders) {
        const startDate = new Date(dateByOrders);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dateByOrders);
        endDate.setHours(23, 59, 59, 999);

        filter.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const orders = await PaymentModel.find(filter)
        .sort({ createdAt: -1 })
        .populate("customerId")
        .populate({
          path: "customerProducts.productId",
          populate: {
            path: "category",
            select: "name",
          },
        })
        .limit(limit * 1)
        .skip((currentPage - 1) * limit)
        .exec();
      const totalItems = await PaymentModel.countDocuments(filter);

      successHandler({
        data: {
          orders,
          currentPage: parseInt(currentPage),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
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
  getPendingOrdersByDate: async (req, res) => {
    try {
      // Logic to get pending orders
      const filter = { status: "pending" };

      const orders = await PaymentModel.find(filter)
        .sort({ createdAt: -1 })
        .select("createdAt _id")
        .exec();

      successHandler({
        data: { orders },

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
    const limit = req.query.limit || 10;
    const currentPage = req.query.currentPage || 1;
    const searchTerm = req.query.searchTerm || "";
    const paymentMethod = req.query.paymentMethod || "";
    const dateByOrders = req.query.dateByOrders || null;

    try {
      const filter = { status: "cancelled" };

      if (searchTerm) {
        filter.$or = [
          { trxId: { $regex: searchTerm, $options: "i" } },
          { phone: { $regex: searchTerm, $options: "i" } },
        ];
      }

      if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
      }

      if (dateByOrders) {
        const startDate = new Date(dateByOrders);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dateByOrders);
        endDate.setHours(23, 59, 59, 999);

        filter.updatedAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const orders = await PaymentModel.find(filter)
        .sort({ updatedAt: -1 })
        .populate("customerId")
        .populate({
          path: "customerProducts.productId",
          populate: {
            path: "category",
            select: "name",
          },
        })
        .limit(limit * 1)
        .skip((currentPage - 1) * limit)
        .exec();
      const totalItems = await PaymentModel.countDocuments(filter);

      successHandler({
        data: {
          orders,
          currentPage: parseInt(currentPage),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
        message: "Orders cancelled fatch successfully",
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
  getCancelledOrdersByDate: async (req, res) => {
    // Logic to get cancelled orders
    try {
      const orders = await PaymentModel.find({ status: "cancelled" })
        .sort({ updatedAt: -1 })
        .select("updatedAt _id")
        .exec();
      successHandler({
        data: { orders },
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
    const limit = req.query.limit || 10;
    const currentPage = req.query.currentPage || 1;
    const searchTerm = req.query.searchTerm || "";
    const paymentMethod = req.query.paymentMethod || "";
    const dateByOrders = req.query.dateByOrders || null;
    try {
      const filter = { status: "delivered" };

      if (searchTerm) {
        filter.$or = [
          { trxId: { $regex: searchTerm, $options: "i" } },
          { phone: { $regex: searchTerm, $options: "i" } },
        ];
      }

      if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
      }

      if (dateByOrders) {
        const startDate = new Date(dateByOrders);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dateByOrders);
        endDate.setHours(23, 59, 59, 999);

        filter.updatedAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const orders = await PaymentModel.find(filter)
        .sort({ createdAt: -1 })
        .populate("customerId")
        .populate({
          path: "customerProducts.productId",
          populate: {
            path: "category",
            select: "name",
          },
        })
        .limit(limit * 1)
        .skip((currentPage - 1) * limit)
        .exec();
      const totalItems = await PaymentModel.countDocuments(filter);
      successHandler({
        data: {
          orders,
          currentPage: parseInt(currentPage),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
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
  getDeliveredOrdersByDate: async (req, res) => {
    // Logic to get delivered orders
    try {
      const orders = await PaymentModel.find({ status: "delivered" })
        .sort({
          updatedAt: -1,
        })
        .select("updatedAt _id");
      successHandler({
        data: { orders },
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
    // Logic to get delivered orders
    const limit = req.query.limit || 10;
    const currentPage = req.query.currentPage || 1;
    const searchTerm = req.query.searchTerm || "";
    const paymentMethod = req.query.paymentMethod || "";
    const dateByOrders = req.query.dateByOrders || null;
    try {
      const filter = { status: "returned" };

      if (searchTerm) {
        filter.$or = [
          { trxId: { $regex: searchTerm, $options: "i" } },
          { phone: { $regex: searchTerm, $options: "i" } },
        ];
      }

      if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
      }

      if (dateByOrders) {
        const startDate = new Date(dateByOrders);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dateByOrders);
        endDate.setHours(23, 59, 59, 999);

        filter.updatedAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }
      const orders = await PaymentModel.find(filter)
        .sort({ updatedAt: -1 })
        .populate("customerId")
        .populate({
          path: "customerProducts.productId",
          populate: {
            path: "category",
            select: "name",
          },
        })
        .limit(limit * 1)
        .skip((currentPage - 1) * limit)
        .exec();
      successHandler({
        data: {
          orders,
          currentPage: parseInt(currentPage),
          totalPages: Math.ceil(orders.length / limit),
          totalItems: orders.length,
        },
        message: "Orders returned",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to returned orders",
        code: 500,
        res,
        req,
      });
    }
  },
  getReturnOrdersByDate: async (req, res) => {
    // Logic to get delivered orders
    try {
      const orders = await PaymentModel.find({ status: "returned" })
        .sort({
          updatedAt: -1,
        })
        .select("updatedAt _id");
      successHandler({
        data: { orders },
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
    const limit = req.query.limit || 10;
    const currentPage = req.query.currentPage || 1;
    const searchTerm = req.query.searchTerm || "";
    const paymentMethod = req.query.paymentMethod || "";
    const dateByOrders = req.query.dateByOrders || null;
    try {
      const filter = { status: "confirmed" };

      if (searchTerm) {
        filter.$or = [
          { trxId: { $regex: searchTerm, $options: "i" } },
          { phone: { $regex: searchTerm, $options: "i" } },
        ];
      }

      if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
      }

      if (dateByOrders) {
        const startDate = new Date(dateByOrders);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dateByOrders);
        endDate.setHours(23, 59, 59, 999);

        filter.updatedAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }
      const orders = await PaymentModel.find(filter)
        .sort({ updatedAt: -1 })
        .populate("customerId")
        .populate({
          path: "customerProducts.productId",
          populate: {
            path: "category",
            select: "name",
          },
        })
        .limit(limit * 1)
        .skip((currentPage - 1) * limit)
        .exec();
      const totalItems = await PaymentModel.countDocuments(filter);
      successHandler({
        data: {
          orders,
          currentPage,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
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
  getCompleteOrdersByDate: async (req, res) => {
    try {
      const filter = { status: "confirmed" };
      const orders = await PaymentModel.find(filter)
        .sort({ updatedAt: -1 })
        .select("updatedAt _id")
        .exec();
      successHandler({
        data: {
          orders,
        },
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
  makeCompletedOrderFromPending: async (req, res) => {
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
  makeDeliveredOrderFromCompleted: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const order = await PaymentModel.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      order.status = "returned";
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
        data: { order },
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
  deleteOrderByAdmin: async (req, res) => {
    // console.log(`req.params.orderIdreq.params.orderId`, );
    // return
    try {
      const orderId = req.params.orderId;
      const response = await PaymentModel.findByIdAndDelete(orderId);
      successHandler({
        data: response,
        message: "Order deleted successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to delete order",
        code: 500,
        res,
        req,
      });
    }
  },
};
