const express = require("express");
const categoryRouter = require("./router/categoryRouter");
const productRouter = require("./router/productRouter");
const userRoleRouter = require("./router/userRoleRouter");
const userRouter = require("./router/userRouter");
const authRouter = require("./router/authRouter");
const websiteRouter = require("./router/websiteRouter");
const cartRouter = require("./router/cartRouter");
const avatarRouter = require("./router/avatarRouter");
const paymentRouter = require("./router/paymentRouter");
const orderRouter = require("./router/orderRouter");
const generalUserRouter = require("./router/generalUserRouter");
const promoCodeRouter = require("./router/promoCodeRouter");
const router = express.Router();

router.use(websiteRouter());
router.use(cartRouter());
router.use(authRouter());
router.use(categoryRouter());
router.use(productRouter());
router.use(userRoleRouter());
router.use(userRouter());
router.use(avatarRouter());
router.use(paymentRouter());
router.use(orderRouter())
router.use(generalUserRouter())
router.use(promoCodeRouter())

module.exports = router;
