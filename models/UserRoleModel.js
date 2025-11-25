const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserRoleSchema = new Schema(
  {
    userRole: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
      enum: [true, false],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userroles", UserRoleSchema);
