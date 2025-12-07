const HeroBannerModel = require("../models/HeroBannerModel");

/**
 * ✅ Create Hero Banner
 */
exports.createHeroBanner = async (req, res) => {
  try {
    const { title, desc, heroImg, status } = req.body;

    if (!title || !desc || !heroImg) {
      return res.status(400).json({
        success: false,
        message: "Title, Description and Image are required",
      });
    }

    const banner = await HeroBannerModel.create({
      title,
      desc,
      heroImg,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Hero Banner created successfully",
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Hero Banner",
      error: error.message,
    });
  }
};

/**
 * ✅ Get All Hero Banners
 */
exports.getAllHeroBanners = async (req, res) => {
  try {
    const banners = await HeroBannerModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Hero Banners",
      error: error.message,
    });
  }
};



/**
 * ✅ Update Hero Banner
 */
exports.updateHeroBanner = async (req, res) => {
  try {
    const banner = await HeroBannerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Hero Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hero Banner updated successfully",
      data: banner,
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
