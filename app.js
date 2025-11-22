const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const allRoutes = require("./routers/all.routes");
require("dotenv").config();
const formData = require("express-form-data");
const bodyParser = require("body-parser");
app.use(formData.parse());

const PORT = process.env.PORT || 9000;

const corsOptions = {
  origin: "*",
  // origin: "https://instancereport.deepseahost.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ], // Allowed headers
  credentials: true, // If you need to send cookies or auth headers
};

app.use(cors(corsOptions));
// 4. Additional Middleware
app.set("json spaces", 4);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(formData.parse());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use('/api',allRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((a) => {
    console.log("✅ Database name", a.connection.name);
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
