const mongoose = require("mongoose");

const HeroBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    heroImg: {
      type: String, // Image URL or file path
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
      enum: [true, false],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("hero", HeroBannerSchema);

