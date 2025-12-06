const express = require("express");
const CartController = require("../../controllers/CartController");
const router = express.Router();

router.post("/cart/add-to-cart", CartController.addToCartInfo);

// router.get("/cart/get-cart", CartController.getCartInfo);

router.post("/cart/update-to-cart/:productId", CartController.updateToCartInfo);

router.get("/cart/remove-from-cart/:productId", CartController.removeFromCart);

router.get("/cart/clear-cart", CartController.clearCart);

module.exports = () => router;
