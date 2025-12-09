const { uploadFile } = require("../middleware/uploadMiddeleware");
const HeroBannerModel = require("../models/HeroBannerModel");
const ErrorHandler = require("../utils/error");
const successHandler = require("../utils/success");
const fs = require("fs");
const path = require("path");

/**
 * ✅ Create Hero Banner
 */
exports.createHeroBanner = async (req, res) => {
  try {
    const { title, desc } = req.body;
    const heroImg = req.files?.heroImg;

    if (!title || !desc || !heroImg) {
      ErrorHandler({
        error: new Error("All fields are required"),
        message: `${!title ? "title is required. " : ""}${
          !desc ? "desc is required. " : ""
        }${!heroImg ? "heroImg is required." : ""}`,
        code: 400,
        res,
        req,
      });
    }

    let horoImage = [];

    if (req.files?.heroImg) {
      horoImage = uploadFile(req.files.heroImg, "uploads/heroimages");
      console.log("banner saved at:", horoImage);
    }

    const banner = await HeroBannerModel.create({
      title,
      desc,
      heroImg: horoImage,
      status: true,
    });

    successHandler({
      data: banner,
      message: "Hero Banner created successfully",
      code: 200,
      res,
      req,
    });
  } catch (error) {
    ErrorHandler({
      error,
      message: "Failed to create Hero Banner",
      code: 500,
      res,
      req,
    });
  }
};

/**
 * ✅ Get All Hero Banners
 */
exports.getAllHeroBanners = async (req, res) => {
  try {
    const banners = await HeroBannerModel.find().sort({ createdAt: -1 });

    successHandler({
      data: banners,
      message: "Hero Banners fetched successfully",
      code: 200,
      res,
      req,
    });
  } catch (error) {
    ErrorHandler({
      error,
      message: "Failed to fetch Hero Banners",
      code: 500,
      res,
      req,
    });
  }
};

/**
 * ✅ Update Hero Banner
 */
exports.updateHeroBanner = async (req, res) => {
  try {
    const { title, desc } = req.body;
    const heroImg = req.files?.heroImg?.[0]; // multer array format
    const { id } = req.params;

    const banner = await HeroBannerModel.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Hero Banner not found",
      });
    }

    if (!title || !desc) {
      return res.status(400).json({
        success: false,
        message: `${!title ? "Title is required. " : ""}${
          !desc ? "Description is required. " : ""
        }`,
      });
    }

    let newImagePath = banner.heroImg;

    if (heroImg) {
      if (banner.heroImg) {
        const oldImagePath = path.join("uploads/heroimages/", banner.heroImg);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      newImagePath = heroImg.filename;
    }

    const updatedBanner = await HeroBannerModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        desc,
        heroImg: newImagePath,
      },
      { new: true, runValidators: true }
    );

    ErrorHandler({
      data: updatedBanner,
      message: heroImg
        ? "Banner updated (image changed) successfully"
        : "Banner updated (image unchanged)",
      code: 200,
      res,
      req,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Hero Banner",
      error: error.message,
    });
  }
};
/**
 * ✅ Delete Hero Banner
 */
exports.deleteHeroBanner = async (req, res) => {
  try {
    const banner = await HeroBannerModel.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Hero Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hero Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Hero Banner",
      error: error.message,
    });
  }
};
