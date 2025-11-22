
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use user ID from request, convert to string if ObjectID
    const userId = req.user?.id?.toString() || "default"; // Convert ObjectID to string
    const uploadDir = path.join("uploads", userId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {

    const filename = file.originalname;

    // Optional: Still check for existing file and handle overwrite
    const userId = req.user?.id?.toString() || "default";
    const filePath = path.join("uploads", userId, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Overwriting existing file: ${filePath}`);
      req.fileOverwritten = true;
      cb(null, filename); // Keep original name if overwriting
    } else {
      cb(null, filename); // Use original  name for new files
    }
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match("image.*")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = upload;
