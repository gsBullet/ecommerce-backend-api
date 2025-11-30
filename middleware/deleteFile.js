const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  try {
    const fullPath = path.join(__dirname, "../", filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("Deleted:", fullPath);
    }
  } catch (error) {
    console.log("File delete error:", error);
  }
};

module.exports = deleteFile;
