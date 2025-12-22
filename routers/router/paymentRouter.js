const express = require("express");
const router = express.Router();
const PaymentController = require("../../controllers/PaymentController");

// Create a new payment
router.post("/payments/manual-create", PaymentController.createPaymentManual);

// Get payment by ID
router.get("/payments/:id", PaymentController.getPaymentById);

// Update payment status
router.put("/payments/:id/status", PaymentController.updatePaymentStatus);

module.exports = () => router;
