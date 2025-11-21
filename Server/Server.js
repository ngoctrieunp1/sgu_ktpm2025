// const express = require("express");
// const cors = require("cors");
// const app = express();

// require("./config/db");

// app.use(cors({
//   origin: "http://localhost:3000",
//   methods: "*"
// }));
// app.use(express.json());

// const myroutes = require("./Routers/Routes");
// const userRoutes = require("./Routers/UserRoutes");
// const CartRoutes = require("./Routers/CartRoutes");
// const orderRoutes = require("./Routers/OrderRoutes");

// app.use("/", myroutes);
// app.use("/", userRoutes);
// app.use("/", CartRoutes);
// app.use("/", orderRoutes);

// // app.get("/health", (req, res) => {
// //   res.status(200).json({ status: "ok" });
// // }); // chỉnh backend docker

// // app.get("/", (req, res) => {
// //   res.status(200).json({
// //     message: "Backend server is running successfully 🚀",
// //     healthcheck: "/health",
// //   });
// // });

// // Khởi chạy server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, (err) => {
//   if (err) {
//     console.error("❌ Server failed to start:", err);
//     process.exit(1);
//   }
//   console.log(`✅ Server is running on port ${PORT}`);
// });


// ----------------------------
//  IMPORT MODULES
// ----------------------------
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");          // 👈 THÊM DÒNG NÀY

// Load biến môi trường từ file .env (nếu có)
dotenv.config();

// ----------------------------
//  INIT EXPRESS APP
// ----------------------------
const app = express();

// ----------------------------
//  CONNECT TO MONGODB
// ----------------------------
require("./config/db");

// ----------------------------
//  MIDDLEWARES
// ----------------------------
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// 👇 THÊM LOG REQUEST Ở ĐÂY
app.use(morgan("dev")); // log dạng: "GET /health 200 15ms - 50"

// ----------------------------
//  ROUTES
// ----------------------------
try {
  const myroutes = require("./Routers/Routes");
  const userRoutes = require("./Routers/UserRoutes");
  const cartRoutes = require("./Routers/CartRoutes");
  const orderRoutes = require("./Routers/OrderRoutes");

  app.use("/", myroutes);
  app.use("/", userRoutes);
  app.use("/", cartRoutes);
  app.use("/", orderRoutes);
} catch (err) {
  console.error("⚠️ Lỗi khi import router:", err.message);
}

// ----------------------------
//  HEALTHCHECK & ROOT ROUTE
// ----------------------------
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "✅ Backend server is running successfully 🚀",
    healthcheck: "/health",
    database: process.env.MONGO_URL ? "MongoDB connected" : "MongoDB not connected",
    environment: process.env.NODE_ENV || "development",
  });
});

// ----------------------------
//  START SERVER
// ----------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 Access: http://localhost:${PORT} or Render public URL`);
});

module.exports = app;
