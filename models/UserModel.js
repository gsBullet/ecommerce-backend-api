const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    password:{
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
      enum: [true, false],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
