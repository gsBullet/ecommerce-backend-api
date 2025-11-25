const UserRoleModel = require("../models/UserRoleModel");
const ErrorHandler = require("../utils/error");
const successHandler = require("../utils/success");

module.exports = {
  addUserRole: async (req, res) => {
    try {
      const { userRole } = req.body;

      const data = await new UserRoleModel({
        userRole,
        status: true,
      }).save();

      if (data) {
        successHandler({
          data,
          message: "User Role Added Successfully",
          code: 201,
          res,
          req,
        });
      }
    } catch (error) {
      if (error.code === 11000) {
        ErrorHandler({
          error,
          message: "User Role already exists",
          code: 409,
          res,
          req,
        });
      } else {
        ErrorHandler({
          error,
          message: "Failed to add User Role",
          code: 500,
          res,
          req,
        });
      }
    }
  },
  updateUserRole: async (req, res) => {
    const { userId } = req.params;
    const data = await UserRoleModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ success: true, data, message: "User Role Updated Successfully" });
  },
  getAllUserList: async (req, res) => {
    const data = await UserRoleModel.find();
    res.status(200).json({
      success: true,
      data,
      message: "User Role List Fetched Successfully",
    });
  },
  deleteUserRole: async (req, res) => {
    const { userId } = req.params;
    await UserRoleModel.findByIdAndDelete(userId);
    res
      .status(200)
      .json({ success: true, message: "User Role Deleted Successfully" });
  },
  updateUserRoleStatus: async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;
    const data = await UserRoleModel.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data,
      message: "User Role Status Updated Successfully",
    });
  },
};
