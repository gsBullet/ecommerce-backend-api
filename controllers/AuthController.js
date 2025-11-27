const bcrypt = require("bcrypt");
const saltRounds = 12;
var jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
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
          message: "Invalid credentials",
        });
      }

      // Create JWT token
      const token = jwt.sign(
        {
          data: {
            fullName: user.fullName,
            userRole: user.userRole,
            createdAt: user.createdAt,
            _id: user._id,
          },
        },
        jwtSecret,
        { expiresIn: "1h" }
      );

      // Remove password before sending data
      const userData = user.toObject();
      delete userData.password;

      return res.status(200).json({
        success: true,
        userData,
        token,
      });
    } catch (error) {
      console.error("Signin Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  singup: async (req, res) => {},
};
