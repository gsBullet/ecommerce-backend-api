const express = require("express");
const router = express.Router();

const {
  createAvatarBanner,
  getAllAvatarBanners,
  updateAvatarBanner,
  deleteAvatarBanner,
  updateAvatarBannerStatus
} = require("../../controllers/AvatarController");

// ✅ Create Banner
router.post("/avatar/create-avatar", createAvatarBanner);

// ✅ Get All Banners
router.get("/avatar/get-all-avatars", getAllAvatarBanners);

// ✅ Update Banner
router.post("/avatar/update-avatar/:id", updateAvatarBanner);
router.post("/avatar-banner/update-avatar-banner-status/:id", updateAvatarBannerStatus);

// ✅ Delete Banner
router.get("/avatar/delete-avatar/:id", deleteAvatarBanner);

module.exports = () => router;
