const { uploadFile } = require("../middleware/uploadMiddeleware");
const AvatarModel = require("../models/AvatarModel");
const ErrorHandler = require("../utils/error");
const successHandler = require("../utils/success");
const fs = require("fs");
const path = require("path");

/**
 * ✅ Create Avatar Banner
 */
exports.createAvatarBanner = async (req, res) => {
  try {
    const { title, desc } = req.body;
    const avatar = req.files?.avatar;

    if (!title || !desc || !avatar) {
      ErrorHandler({
        error: new Error("All fields are required"),
        message: `${!title ? "title is required. " : ""}${
          !desc ? "desc is required. " : ""
        }${!avatar ? "avatar is required." : ""}`,
        code: 400,
        res,
        req,
      });
    }

    let avatarImage = [];

    if (req.files?.avatar) {
      avatarImage = uploadFile(req.files.avatar, "uploads/avatars");
      console.log("banner saved at:", avatarImage);
    }

    const banner = await AvatarModel.create({
      title,
      desc,
      avatar: avatarImage,
      status: true,
    });

    successHandler({
      data: banner,
      message: "Avatar Banner created successfully",
      code: 200,
      res,
      req,
    });
  } catch (error) {
    ErrorHandler({
      error,
      message: "Failed to create Avatar Banner",
      code: 500,
      res,
      req,
    });
  }
};

/**
 * ✅ Get All Avatar Banners
 */
exports.getAllAvatarBanners = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const banners = await AvatarModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    successHandler({
      data: {
        banners,
        currentPage: parseInt(page),
        totalPages: Math.ceil(banners.length / limit),
        totalItems: await AvatarModel.countDocuments(),
      },
      message: "Avatar Banners fetched successfully",
      code: 200,
      res,
      req,
    });
  } catch (error) {
    ErrorHandler({
      error,
      message: "Failed to fetch Avatar Banners",
      code: 500,
      res,
      req,
    });
  }
};

/**
 * ✅ Update Avatar Banner
 */
exports.updateAvatarBanner = async (req, res) => {
  try {
    const { title, desc } = req.body;
    const avatarImg = req.files?.avatar;
    console.log("avatarImg:", avatarImg);

    const { id } = req.params;

    const avatar = await AvatarModel.findById({ _id: id });

    if (!avatar) {
      return res.status(404).json({
        success: false,
        message: "Avatar not found",
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

    let newAvatarPath = avatar.avatar;

    console.log("newAvatarPath:", newAvatarPath);

    // If new file uploaded
    if (avatarImg) {
      // delete old image
      if (avatar.avatar) {
        const oldImagePath = path.join("uploads/avatars/", avatar.avatar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image to folder
      const uploadPath = uploadFile(avatarImg, "uploads/avatars/");
      newAvatarPath = uploadPath;
    }

    const updatedBanner = await AvatarModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        desc,
        avatar: newAvatarPath,
      },
      { new: true, runValidators: true }
    );
    successHandler({
      data: updatedBanner,
      message: "Avatar Banner updated successfully",
      code: 200,
      res,
      req,
    });
  } catch (error) {
    ErrorHandler({
      error,
      message: "Failed to update Avatar Banner",
      code: 500,
      res,
      req,
    });
  }
};

/**
 * ✅ update Avatar Banner
 */
exports.updateAvatarBannerStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const response = await AvatarModel.findByIdAndUpdate(
      { _id: id },
      {
        status,
      },
      { new: true, runValidators: true }
    );
    return successHandler({
      data: response,
      message: "Avatar Banner status updated successfully",
      code: 200,
      res,
      req,
    });
  } catch (error) {
    ErrorHandler({
      error,
      message: "Failed to update Avatar Banner status",
      code: 500,
      res,
      req,
    });
  }
};

/**
 * ✅ Delete Avatar Banner
 */
exports.deleteAvatarBanner = async (req, res) => {
  try {
    const banner = await AvatarModel.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Avatar Banner not found",
      });
    }
    successHandler({
      data: banner,
      message: "Avatar Banner deleted successfully",
      code: 200,
      res,
      req,
    });
  } catch (error) {
    ErrorHandler({
      error,
      message: "Failed to delete Avatar Banner",
      code: 500,
      res,
      req,
    });
  }
};
