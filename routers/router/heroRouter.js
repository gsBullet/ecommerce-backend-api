const express = require("express");
const router = express.Router();

const {
  createHeroBanner,
  getAllHeroBanners,
  updateHeroBanner,
  deleteHeroBanner,
} = require("../../controllers/HeroController");

// ✅ Create Banner
router.post("/hero/create-hero-banner", createHeroBanner);

// ✅ Get All Banners
router.get("/hero/get-all-hero-banners", getAllHeroBanners);

// ✅ Update Banner
router.post("/hero/update-hero-banner/:id", updateHeroBanner);

// ✅ Delete Banner
router.get("/hero/delete-hero-banner/:id", deleteHeroBanner);

module.exports =()=> router;
