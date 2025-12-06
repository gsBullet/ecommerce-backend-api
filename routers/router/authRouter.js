const express = require("express");
const AuthController = require("../../controllers/AuthController");
const GeneralUserController = require("../../controllers/GeneralUserController");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.post(
  "/auth/register-general-users",
  GeneralUserController.registerCustomerUser
);
router.post(
  "/auth/general-user-login",
  GeneralUserController.loginCustomerUser
);
router.post(
  "/auth/general-user-forgot-password",
  GeneralUserController.forgotPasswordCustomerUser
);
router.post("/auth/sign-in", AuthController.signin);
router.post("/auth/sign-up", AuthController.singup);
router.use(authMiddleware);
router.get("/auth/check-auth", AuthController.checkAuth);

module.exports = () => router;
