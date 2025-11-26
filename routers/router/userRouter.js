const express = require("express");
const UserController = require("../../controllers/UserController");
const router = express.Router();

router.post("/user/add-user", UserController.addUser);

router.post(
  "/user/update-user/:userId",
  UserController.updateUser
);

router.get("/user/get-all-users", UserController.getAllUserList);

router.get(
  "/user/delete-user/:userId",
  UserController.deleteUser
);
router.post(
  "/user/update-user-status/:userId",
  UserController.updateUserStatus
);

module.exports =()=> router;
