const express = require("express");
const categoryRouter = require("./router/categoryRouter");
const productRouter = require("./router/productRouter");
const userRoleRouter = require("./router/userRoleRouter");
const router = express.Router();

router.use(categoryRouter())
router.use(productRouter())
router.use(userRoleRouter())


module.exports = router