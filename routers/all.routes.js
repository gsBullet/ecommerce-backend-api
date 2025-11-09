const express = require("express");
const categoryRouter = require("./router/categoryRouter");
const router = express.Router();

router.use(categoryRouter())


module.exports = router