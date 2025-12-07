const express = require("express");
const categoryRouter = require("./router/categoryRouter");
const productRouter = require("./router/productRouter");
const userRoleRouter = require("./router/userRoleRouter");
const userRouter = require("./router/userRouter");
const authRouter = require("./router/authRouter");
const websiteRouter = require("./router/websiteRouter");
const cartRouter = require("./router/cartRouter");
const heroRouter = require("./router/heroRouter");
const router = express.Router();

router.use(websiteRouter());
router.use(cartRouter());
router.use(authRouter());
router.use(categoryRouter());
router.use(productRouter());
router.use(userRoleRouter());
router.use(userRouter());
router.use(heroRouter());

module.exports = router;
