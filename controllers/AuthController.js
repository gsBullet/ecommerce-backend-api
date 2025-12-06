const bcrypt = require("bcrypt");
const saltRounds = 12;
var jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const GeneralUsersModel = require("../models/GeneralUsersModel");
const ErrorHandler = require("../utils/error");
const successHandler = require("../utils/success");
const jwtSecret = "842a2780-bb8e-482c-b22c-823084e1f054";
module.exports = {
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user and INCLUDE password for comparison
      const user = await UserModel.findOne({ email }).select("+password");
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "password does not match",
        });
      }

      const token = jwt.sign(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          userRole: user.userRole,
          createdAt: user.createdAt,
          _id: user._id,
        },
        jwtSecret,
        { expiresIn: "7d" }
      );

      // Remove password before sending data
      const userData = user.toObject();
      delete userData.password;

      return res.status(200).json({
        success: true,
        data: userData,
        token,
        message: "User Singin Successfully",
      });
    } catch (error) {
      console.error("Signin Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  checkAuth: async (req, res) => {
    try {
      const isCustomer = req.userData?.userRole === "customer";

      const Model = isCustomer ? GeneralUsersModel : UserModel;

      const user = await Model.findById(req.userData?._id)
        .select(isCustomer ? "" : "-password")
        .lean();

      if (!user) {
        return ErrorHandler({
          error: "Unauthorized",
          message: "User not found",
          code: 401,
          res,
          req,
        });
      }

      return successHandler({
        data: user,
        message: "Authorized User",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      return ErrorHandler({
        error,
        message: "Authorization failed",
        code: 401,
        res,
        req,
      });
    }
  },

  singup: async (req, res) => {},
};
