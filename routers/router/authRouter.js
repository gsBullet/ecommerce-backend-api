const express = require("express");
const AuthController = require("../../controllers/AuthController");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/auth/sign-in", AuthController.signin);
router.post("/auth/sign-up", AuthController.singup);
router.use(authMiddleware);
router.get("/auth/check-auth", AuthController.checkAuth);

module.exports = () => router;
