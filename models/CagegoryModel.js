const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },

    // 🔥 NEW FIELD
    discountEligible: {
      type: Boolean,
      default: false, // only true categories will get discount
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", categorySchema);
