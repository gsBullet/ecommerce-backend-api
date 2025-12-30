const express = require("express");
const OrderController = require("../../controllers/OrderController");
const router = express.Router();

router.get("/orders/pending-orders", OrderController.getPendingOrders);
router.get("/orders/cancelled-orders", OrderController.getCancelledOrders);
router.get("/orders/delivered-orders", OrderController.getDeliveredOrders);
router.get("/orders/return-orders", OrderController.getReturnOrders);
router.get("/orders/get-completed-orders", OrderController.getCompleteOrders);
router.get("/orders/order-details", OrderController.getOrderDetails);
router.post(
  "/orders/update-order-status/:orderId",
  OrderController.updateOrderStatus
);
router.get(
  "/orders/completed-orders/:orderId",
  OrderController.makeCompletedOrder
);
router.get(
  "/orders/cancelling-orders/:orderId",
  OrderController.makeCancellingOrder
);

module.exports = () => router;
