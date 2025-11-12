// // Server/config/db.js
// require('dotenv').config();
// const mongoose = require('mongoose');

// const uri =
//   process.env.MONGODB_URI ||
//   process.env.MONGODB_URL ||
//   'mongodb://host.docker.internal:27017/foodapp';

// mongoose.connection.on('connected', () => {
//   console.log('mongoose connected to', uri);
// });
// mongoose.connection.on('disconnected', () => {
//   console.log('mongoose disconnected');
// });
// mongoose.connection.on('error', (err) => {
//   console.error('db connection error:', err.message);
// });

// (async () => {
//   try {
//     await mongoose.connect(uri, {
//       serverSelectionTimeoutMS: 10000,
//     });
//   } catch (err) {
//     console.error('initial connect failed:', err.message);
//   }
// })();


// ----------------------------
//  Server/config/db.js
// ----------------------------
require("dotenv").config();
const mongoose = require("mongoose");

// ----------------------------
//  CHỌN URI KẾT NỐI
// ----------------------------
// Giữ nguyên hỗ trợ các biến môi trường cũ + thêm MONGO_URL cho Render
const uri =
  process.env.MONGO_URL ||                // Render / Atlas
  process.env.MONGODB_URI ||              // fallback 1
  process.env.MONGODB_URL ||              // fallback 2
  "mongodb://127.0.0.1:27017/foodapp";    // local / Docker

// ----------------------------
//  SỰ KIỆN KẾT NỐI (giữ nguyên logic cũ)
// ----------------------------
mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to:", uri);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("🚨 DB connection error:", err.message);
});

// ----------------------------
//  KẾT NỐI DATABASE (được cải tiến cho Render)
// ----------------------------
(async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log(
      "✅ MongoDB connection successful:",
      uri.includes("mongodb+srv") ? "Atlas Cloud (Render)" : "Local/Docker"
    );
  } catch (err) {
    console.error("❌ Initial MongoDB connection failed:", err.message);
    process.exit(1); // để Render tự restart service
  }
})();

// ----------------------------
//  EXPORT
// ----------------------------
module.exports = mongoose;
