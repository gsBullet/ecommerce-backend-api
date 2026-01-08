const express = require("express");
const OrderController = require("../../controllers/OrderController");
const router = express.Router();

router.get("/orders/pending-orders", OrderController.getPendingOrders);
router.get(
  "/orders/pending-orders-by-date",
  OrderController.getPendingOrdersByDate
);
router.get("/orders/cancelled-orders", OrderController.getCancelledOrders);
router.get("/orders/cancelled-orders-by-date", OrderController.getCancelledOrdersByDate);
router.get("/orders/delivered-orders", OrderController.getDeliveredOrders);
router.get("/orders/return-orders", OrderController.getReturnOrders);
router.get("/orders/return-orders-by-date", OrderController.getReturnOrdersByDate);
router.get("/orders/get-completed-orders", OrderController.getCompleteOrders);
router.get(
  "/orders/get-completed-orders-by-date",
  OrderController.getCompleteOrdersByDate
);
router.get(
  "/orders/delivered-orders-by-date",
  OrderController.getDeliveredOrdersByDate
);
router.get("/orders/order-details", OrderController.getOrderDetails);
router.post(
  "/orders/update-order-status/:orderId",
  OrderController.updateOrderStatus
);
router.get(
  "/orders/completed-orders/:orderId",
  OrderController.makeCompletedOrderFromPending
);
router.get(
  "/orders/delevered-orders-from-completed/:orderId",
  OrderController.makeDeliveredOrderFromCompleted
);
router.get(
  "/orders/cancelling-orders/:orderId",
  OrderController.makeCancellingOrder
);
router.get(
  "/orders/delete-order-by-admin/:orderId",
  OrderController.deleteOrderByAdmin
);


module.exports = () => router;
