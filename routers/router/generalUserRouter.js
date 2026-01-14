const express = require("express");
const GeneralUserController = require("../../controllers/GeneralUserController");
const router = express.Router();

router.get(
  "/general-users/get-all-general-users",
  GeneralUserController.getAllPendingGeneralUserList
);
router.get(
  "/general-users/get-all-verify-users",
  GeneralUserController.getAllGeneralVerifyUserList
);
router.get(
  "/general-users/get-all-star-users",
  GeneralUserController.getAllGeneralStarUserList
);
router.get(
  "/general-users/get-all-star-users",
  GeneralUserController.getAllGeneralStarUserList
);
router.get(
  "/general-users/get-all-block-users",
  GeneralUserController.getAllGeneralBlockUserList
);

router.get(
  "/general-user/change-user-status/:userId",
  GeneralUserController.changeGeneralUserStatus
);
router.get(
  "/general-users/get-all-payment-order-by-user/:userId",
  GeneralUserController.getAllPaymentOrdersByUser
);
module.exports = () => router;
