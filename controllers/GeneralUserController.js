// controllers/authController.js
const jwt = require("jsonwebtoken");
const GeneralUsersModel = require("../models/GeneralUsersModel");
const successHandler = require("../utils/success");
const ErrorHandler = require("../utils/error");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const jwtSecret = "842a2780-bb8e-482c-b22c-823084e1f054";

module.exports = {
  // Register
  registerCustomerUser: async (req, res) => {
    console.log(req.body);

    try {
      const { name, email, password, phone } = req.body;

      const existingUser = await GeneralUsersModel.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email already exists" });

      const existingPhone = await GeneralUsersModel.findOne({ phone });
      if (existingPhone)
        return res.status(400).json({ message: "Phone number already exists" });

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await GeneralUsersModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
      });

      successHandler({
        data: user,
        message: "User registered successfully",
        code: 201,
        res,
        req,
      });
    } catch (err) {
      ErrorHandler({
        error: err,
        message: "Failed to register user",
        code: 500,
        res,
        req,
      });
    }
  },

  // Login
  loginCustomerUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await GeneralUsersModel.findOne({ email })
        .select("+password")
        .lean();

      if (!user)
        return res.status(401).json({
          success: false,
          message: "User not registered",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(401)
          .json({ success: false, message: "Password does not match" });

      const token = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          userRole: user.role,
        },
        jwtSecret,
        {
          expiresIn: "7d",
        }
      );
      delete user.password;
      if (user && token) {
        successHandler({
          data: {
            user,
            token,
          },
          message: "User logged in successfully",
          code: 200,
          res,
          req,
        });
      } else {
        ErrorHandler({
          error: err,
          message: "Failed to login user",
          code: 500,
          res,
          req,
        });
      }
    } catch (err) {
      ErrorHandler({
        error: err,
        message: "Failed to login user",
        code: 500,
        res,
        req,
      });
    }
  },
  forgotPasswordCustomerUser: async (req, res) => {
    const { email, phone, password } = req.body;
    if (email) {
      const checkEmail = await GeneralUsersModel.findOne({ email });
      if (!checkEmail) {
        return res.status(400).json({
          success: false,
          message: "Email does not found",
        });
      }
    }
    if (phone) {
      const checkPhone = await GeneralUsersModel.findOne({ phone });
      if (!checkPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number does not found",
        });
      }
    }
    if (email && phone) {
      const user = await GeneralUsersModel.findOne({ email, phone });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
      try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
        await user.save();
        successHandler({
          data: user,
          message: "Password updated successfully",
          code: 200,
          res,
          req,
        });
      } catch (err) {
        ErrorHandler({
          error: err,
          message: "Failed to update password",
          code: 500,
          res,
          req,
        });
      }
    }
  },
};
