const express = require("express");
const categoryRouter = require("./router/categoryRouter");
const productRouter = require("./router/productRouter");
const router = express.Router();

router.use(categoryRouter())
router.use(productRouter())


module.exports = router