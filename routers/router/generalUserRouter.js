const express = require("express");
const GeneralUserController = require("../../controllers/GeneralUserController");
const router = express.Router();

router.get(
    "/general-users/get-all-general-users",
    GeneralUserController.getAllPendingGeneralUserList
);

router.get(
    "/general-user/change-user-status/:userId",
    GeneralUserController.changeGeneralUserStatus
);
module.exports = () => router;