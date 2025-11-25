const ProductModel = require("../models/ProductModel");
const CategoryModel = require("../models/CagegoryModel");
const fs = require("fs");
const path = require("path");
const { uploadFile } = require("../middleware/uploadMiddeleware");

module.exports = {
  addProduct: async (req, res) => {
    try {
      const {
        id,
        name,
        description,
        old_price,
        new_price,
        category,
        quantity,
        available = true,
        status = true,
      } = req.body;

      // Check if product already exists
      const existingProduct = await ProductModel.findOne({
        $or: [{ id }, { name }],
      });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Product with the same ID or name already exists",
        });
      }

      // Handle file paths for local storage
      let thumbnail = [];
      let related_images = [];

      // Process thumbnail
      if (req.files?.thumbnail) {
        thumbnail = uploadFile(req.files.thumbnail, "uploads/products");
        console.log("Thumbnail saved at:", thumbnail);
      }

      // Process multiple images
      if (req.files?.related_images) {
        const images = req.files.related_images;
        images.forEach((image) => {
          related_images.push(uploadFile(image, "uploads/related_images"));
        });
        console.log("Related images saved at:", related_images);
      }

      // Validate required fields
      if (!thumbnail) {
        return res.status(400).json({
          success: false,
          message: "Thumbnail is required",
        });
      }

      if (related_images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one product image is required",
        });
      }

      // Create product
      const product = new ProductModel({
        id,
        name,
        description,
        old_price: parseFloat(old_price),
        new_price: parseFloat(new_price),
        category,
        thumbnail: thumbnail,
        related_images: related_images,
        quantity: parseInt(quantity),
        available: available === "true",
        status: status === "true",
      });

      const savedProduct = await product.save();

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: savedProduct,
      });
    } catch (error) {
      // Delete uploaded files if error occurs
      if (req.files?.thumbnail?.length) {
        const file = req.files.thumbnail[0];

        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
      if (req.files?.related_images?.length) {
        req.files.related_images.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }

      console.error("Create product error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating product",
        error: error.message,
      });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        category = "",
        available = "",
        sort = "createdAt",
        order = "desc",
      } = req.query;

      const query = {};

      // Search by name or description
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { id: { $regex: search, $options: "i" } },
        ];
      }

      // Filter by category
      if (category) {
        query.category = category;
      }

      // Filter by availability
      if (available !== "") {
        query.available = available === "true";
      }

      const sortOrder = order === "desc" ? -1 : 1;
      const sortOptions = { [sort]: sortOrder };

      const products = await ProductModel.find(query)
        .populate("category", "name")
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await ProductModel.countDocuments(query);

      res.json({
        success: true,
        data: products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching products",
        error: error.message,
      });
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await ProductModel.findOne({
        $or: [{ _id: id }, { id: id }],
      }).populate("category", "name description");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching product",
        error: error.message,
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      console.log(productId);

      const updateData = { ...req.body };

      // Check if product exists
      const product = await ProductModel.findOne({ _id: productId });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Check if new name already exists (excluding current product)
      if (updateData.name && updateData.name !== product.name) {
        const existingProduct = await ProductModel.findOne({
          name: updateData.name,
          id: { $ne: product.id },
        });
        if (existingProduct) {
          return res.status(400).json({
            success: false,
            message: "Product name already exists",
          });
        }
      }

      // Handle file paths for local storage
      let thumbnail = [];
      let related_images = [];

      // Process thumbnail
      if (req.files?.thumbnail) {
        thumbnail = uploadFile(req.files.thumbnail, "uploads/products");
        console.log("Thumbnail saved at:", thumbnail);
      }

      // Process multiple images
      if (req.files?.related_images) {
        const images = req.files.related_images;
        images.forEach((image) => {
          related_images.push(uploadFile(image, "uploads/related_images"));
        });
        console.log("Related images saved at:", related_images);
      }
      // Update file paths if new files were uploaded
      if (thumbnail.length > 0) {
        updateData.thumbnail = thumbnail;
      }
      if (related_images.length > 0) {
        updateData.related_images = related_images;
      }

      // Convert string values to appropriate types
      if (updateData.old_price)
        updateData.old_price = parseFloat(updateData.old_price);
      if (updateData.new_price)
        updateData.new_price = parseFloat(updateData.new_price);
      if (updateData.quantity)
        updateData.quantity = parseInt(updateData.quantity);
      if (updateData.available)
        updateData.available = updateData.available === "true";
      if (updateData.status) updateData.status = updateData.status === "true";

      // Update product
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: productId },
        updateData,
        { new: true, runValidators: true }
      ).populate("category", "name");

      res.json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating product",
        error: error.message,
      });
    }
  },

  updateProductStatus: async (req, res) => {
    try {
      const { productId } = req.params;
      const { status } = req.body;

      // Check if product exists
      const product = await ProductModel.findOne({
        _id: productId,
      });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      product.status = status;
      await product.save();

      res.json({
        success: true,
        message: "Product status updated successfully",
        data: product,
      });
    } catch (error) {
      console.error("Update product status error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating product status",
        error: error.message,
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await ProductModel.findOne({
        $or: [{ _id: id }, { id: id }],
      });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Delete images from file system
      if (product.thumbnail && fs.existsSync(product.thumbnail)) {
        fs.unlinkSync(product.thumbnail);
      }

      if (product.images && product.images.length > 0) {
        product.images.forEach((imagePath) => {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }

      await ProductModel.findOneAndDelete({ $or: [{ _id: id }, { id: id }] });

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting product",
        error: error.message,
      });
    }
  },
};
