const UserModel = require("../models/UserModel");
const ErrorHandler = require("../utils/error");
const successHandler = require("../utils/success");
const bcrypt = require("bcrypt");
const saltRounds = 12;

module.exports = {
  addUser: async (req, res) => {
    try {
      const { firstName, lastName, email, password, userRole, phone } =
        req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const data = await new UserModel({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        userRole,
        status: true,
      }).save();

      if (data) {
        successHandler({
          data,
          message: "User  Added Successfully",
          code: 201,
          res,
          req,
        });
      }
    } catch (error) {
      if (error.code === 11000) {
        ErrorHandler({
          error,
          message: `User  already exists`,
          code: 409,
          res,
          req,
        });
      } else {
        ErrorHandler({
          error,
          message: "Failed to add User ",
          code: 500,
          res,
          req,
        });
      }
    }
  },
  updateUser: async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, email, phone, userRole, password } = req.body;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      req.body.password = hashedPassword;
      const data = await UserModel.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      return successHandler({
        data,
        message: "User  Updated Successfully",
        code: 200,
        res,
        req,
      });
    } else {
      const data = await UserModel.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          email,
          phone,
          userRole,
        },
        {
          new: true,
        }
      );
      return successHandler({
        data,
        message: "User  Updated Successfully",
        code: 200,
        res,
        req,
      });
    }
  },
  getAllUserList: async (req, res) => {
    const data = await UserModel.find()
      .populate("userRole", "_id userRole")
      .sort({ createdAt: -1 })
      .exec();
    if (data) {
      successHandler({
        data,
        message: "User s fetched successfully",
        code: 200,
        res,
        req,
      });
    }
  },
  deleteUser: async (req, res) => {
    const { userId } = req.params;
    await UserModel.findByIdAndDelete(userId);
    res
      .status(200)
      .json({ success: true, message: "User  Deleted Successfully" });
  },
  updateUserStatus: async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    try {
      const data = await UserModel.findByIdAndUpdate(
        userId,
        { status },
        { new: true }
      );
      successHandler({
        data,
        message: "User  status updated successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to update User  status",
        code: 500,
        res,
        req,
      });
    }
  },
};
