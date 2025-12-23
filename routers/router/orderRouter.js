const express = require("express");
const OrderController = require("../../controllers/OrderController");
const router = express.Router();

router.get("/orders/pending-orders", OrderController.getPendingOrders);
router.get("/orders/cancelled-orders", OrderController.getCancelledOrders);
router.get("/orders/delivered-orders", OrderController.getDeliveredOrders);
router.get("/orders/return-orders", OrderController.getReturnOrders);
router.get("/orders/complete-orders", OrderController.getCompleteOrders);
router.get("/orders/order-details", OrderController.getOrderDetails);
router.post(
  "/orders/update-order-status/:orderId",
  OrderController.updateOrderStatus
);

module.exports = () => router;
