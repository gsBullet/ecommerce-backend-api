// controllers/authController.js
const jwt = require("jsonwebtoken");
const GeneralUsersModel = require("../models/GeneralUsersModel");
const successHandler = require("../utils/success");
const ErrorHandler = require("../utils/error");
const bcrypt = require("bcrypt");
const PaymentModel = require("../models/PaymentModel");
const { default: mongoose } = require("mongoose");
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
  updateCustomerUserInfo: async (req, res) => {
    try {
      const {
        fullName,
        phone,
        email,
        address,
        state,
        postalCode,
        city,
        deliveryMethod,
      } = req.body.formData;

      const userId = req.params.userId;

      const user = await GeneralUsersModel.findById(userId);

      if (!user) {
        return ErrorHandler({
          message: "User not found",
          code: 404,
          res,
          req,
        });
      }

      // 🔹 IF address exists → UPDATE first address
      if (user.addresses.length > 0) {
        user.addresses[0].fullName = fullName;
        user.addresses[0].email = email;
        user.addresses[0].phone = phone;
        user.addresses[0].address = address;
        user.addresses[0].city = city;
        user.addresses[0].state = state;
        user.addresses[0].postalCode = postalCode;
        user.addresses[0].deliveryMethod = deliveryMethod;
      }
      // 🔹 IF address empty → PUSH
      else {
        user.addresses.push({
          fullName,
          phone,
          email,
          address,
          city,
          state,
          postalCode,
          deliveryMethod,
          country: "Bangladesh",
        });
      }

      await user.save();

      successHandler({
        data: user,
        message: "User info updated successfully",
        code: 200,
        res,
        req,
      });
    } catch (err) {
      ErrorHandler({
        error: err,
        message: "Failed to update user info",
        code: 500,
        res,
        req,
      });
    }
  },
  getAllPendingGeneralUserList: async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const search = req.query.searchTerm || "";
    try {
      const filter = { activeUserStatus: "pending" };
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }
      const users = await GeneralUsersModel.find(filter)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec();
      const count = await GeneralUsersModel.countDocuments(filter);
      const payments = await PaymentModel.find();
      const usersWithPayments = users.map((user) => {
        const totalPayment = payments.reduce((total, payment) => {
          return payment.customerId?.toString() === user._id.toString()
            ? total + 1
            : total;
        }, 0);

        return {
          ...user.toObject(),
          totalPayment,
        };
      });

      // console.log(usersWithPayments);

      successHandler({
        data: {
          users: usersWithPayments,
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
        },
        message: "General User List fetched successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to fetch General User List",
        code: 500,
        res,
        req,
      });
    }
  },
  changeGeneralUserStatus: async (req, res) => {},
  getAllPaymentOrdersByUser: async (req, res) => {
    try {
      const userId = req.params.userId;

      const limit = Number(req.query.limit) || 10;
      const page = Number(req.query.currentPage) || 1;
      const skip = (page - 1) * limit;

      const search = req.query.searchTerm || "";
      const activeTab = req.query.activeTab || "all";

      const customerObjectId = new mongoose.Types.ObjectId(userId);

      const baseFilter = { customerId: customerObjectId };

      if (search) {
        baseFilter.$or = [
          { trxId: { $regex: search, $options: "i" } },
          { paymentMethod: { $regex: search, $options: "i" } },
        ];
      }

      // 🔥 1️⃣ STATUS COUNT (ALL STATUSES)
      const statusAggregation = await PaymentModel.aggregate([
        { $match: baseFilter },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const statusCount = {
        all: 0,
        pending: 0,
        confirmed: 0,
        delivered: 0,
        cancelled: 0,
        returned: 0,
      };

      statusAggregation.forEach((item) => {
        statusCount[item._id] = item.count;
        statusCount.all += item.count;
      });

      // 🔥 2️⃣ FILTER FOR CURRENT TAB
      const orderFilter =
        activeTab === "all" ? baseFilter : { ...baseFilter, status: activeTab };

      // 🔥 3️⃣ ORDERS + COUNT
      const [orders, totalItems] = await Promise.all([
        PaymentModel.find(orderFilter)
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit),

        PaymentModel.countDocuments(orderFilter),
      ]);

      successHandler({
        data: {
          orders,
          totalItems,
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          statusCount,
        },
        message: "Orders fetched successfully",
        code: 200,
        res,
        req,
      });
    } catch (error) {
      ErrorHandler({
        error,
        message: "Failed to fetch orders",
        code: 500,
        res,
        req,
      });
    }
  },
};
