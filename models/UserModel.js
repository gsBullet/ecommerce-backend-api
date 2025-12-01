const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
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
      // unique: true,
    },
    userRole: {
      type: Schema.Types.ObjectId,
      ref: "userroles",
      required: true,
    },
    password: {
      type: String,
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
