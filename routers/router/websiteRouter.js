const express = require("express");
const WebsitController = require("../../controllers/WebsitController");
const router = express.Router();

router.get("/products", WebsitController.getWebsiteProducts);
router.get("/new-collections", WebsitController.getNewProducts);

module.exports = () => router;
