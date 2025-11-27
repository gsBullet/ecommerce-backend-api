const express = require("express");
const AuthController = require("../../controllers/AuthController");
const router = express.Router();

router.post("/auth/sign-in", AuthController.signin);
router.post("/auth/sign-up", AuthController.singup);

module.exports = () => router;
