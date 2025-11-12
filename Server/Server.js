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



const express = require("express");
const cors = require("cors");
const app = express();

require("./config/db");

// CORS: ưu tiên ENV, fallback localhost:3000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: "*",
  })
);

app.use(express.json());

// Routers
const myroutes = require("./Routers/Routes");
const userRoutes = require("./Routers/UserRoutes");
const CartRoutes = require("./Routers/CartRoutes");
const orderRoutes = require("./Routers/OrderRoutes");

app.use("/", myroutes);
app.use("/", userRoutes);
app.use("/", CartRoutes);
app.use("/", orderRoutes);

// ---- Health & Root ping (trả OK) ----
const ping = (req, res) => res.status(200).json({ status: "ok" });
app.get("/health", ping);
app.get("/", ping);

// Khởi chạy server
const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
  console.log(`✅ Server is running on port ${PORT}`);
});
