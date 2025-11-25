const express = require("express");
const UserRoleController = require("../../controllers/UserRoleController");
const router = express.Router();

router.post("/user-role/add-user-role", UserRoleController.addUserRole);

router.post(
  "/user-role/update-user-role/:userId",
  UserRoleController.updateUserRole
);

router.get("/user-role/get-all-user-roles", UserRoleController.getAllUserList);

router.get(
  "/user-role/delete-user-role/:userId",
  UserRoleController.deleteUserRole
);
router.get(
  "/user-role/update-user-role-status/:userId",
  UserRoleController.updateUserRoleStatus
);

module.exports =()=> router;
