// Server/Controllers/OrderController.js
const mongoose = require("mongoose");
const orderCollection = require("../models/OrderModel");
const productsCollection = require("../models/productModels");
const CartCollection = require("../models/CartModels");

/**
 * POST /placeorder
 */
const placeOrder = async (req, res) => {
  try {
    const { userId, products, address } = req.body;
    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const itemIds = products.map((p) => p.productId);
    const items = await productsCollection
      .find({ _id: { $in: itemIds } })
      .select("_id name price restaurantId")
      .lean();

    const orderProducts = products.map((p) => {
      const item = items.find((i) => String(i._id) === String(p.productId));
      if (!item) throw new Error(`Product not found: ${p.productId}`);
      return {
        productId: item._id,
        name: item.name,
        price: Number(item.price ?? 0),
        quantity: Number(p.quantity ?? 1),
        restaurantId: item.restaurantId,
      };
    });

    const subtotal = orderProducts.reduce(
      (sum, pr) => sum + pr.price * pr.quantity,
      0
    );

    const order = await orderCollection.create({
      userId: new mongoose.Types.ObjectId(userId),
      address,
      products: orderProducts,
      totalAmount: subtotal,
      // LƯU TRẠNG THÁI TẠI FIELD `status` (schema hiện tại của bạn)
      status: "Payment pending",
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("placeOrder error:", error);
    return res
      .status(400)
      .json({ message: error?.message || "Create order failed" });
  }
};

/**
 * POST /placeorder-split
 * (tạo nhiều đơn theo từng nhà hàng)
 */
const placeOrderSplit = async (req, res) => {
  try {
    const { userId, products, address } = req.body;
    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const itemIds = products.map((p) => p.productId);
    const items = await productsCollection
      .find({ _id: { $in: itemIds } })
      .select("_id name price restaurantId")
      .lean();

    const lines = products.map((p) => {
      const it = items.find((i) => String(i._id) === String(p.productId));
      if (!it) throw new Error(`Product not found: ${p.productId}`);
      return {
        productId: it._id,
        name: it.name,
        price: Number(it.price ?? 0),
        quantity: Number(p.quantity ?? 1),
        restaurantId: it.restaurantId,
      };
    });

    // group theo restaurantId
    const groups = new Map();
    for (const l of lines) {
      const rid = String(l.restaurantId);
      if (!groups.has(rid)) groups.set(rid, []);
      groups.get(rid).push(l);
    }

    const docsToCreate = [];
    for (const [, arr] of groups) {
      const subtotal = arr.reduce((s, x) => s + x.price * x.quantity, 0);
      docsToCreate.push({
        userId: new mongoose.Types.ObjectId(userId),
        address,
        products: arr,
        totalAmount: subtotal,
        status: "Payment pending",
      });
    }

    const created = await orderCollection.insertMany(docsToCreate);
    return res.status(201).json(created);
  } catch (err) {
    console.error("placeOrderSplit error:", err);
    return res
      .status(400)
      .json({ message: err?.message || "Create order failed" });
  }
};

/**
 * PATCH /updateorder/:orderId
 * DEMO: dùng field `status` để lưu thanh toán:
 *  - "Payment pending"
 *  - "Payment completed"
 *
 * Đồng thời hỗ trợ payload cũ/mới:
 *  - { status: "Payment completed" }  (khuyến nghị hiện tại)
 *  - { payment_status: "Paid" | "Payment pending" }  (tương thích)
 */
const updateOrdersts = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, payment_status } = req.body || {};

    const patch = {};

    if (typeof status === "string" && status.length > 0) {
      // FE gửi đúng `status` -> lưu trực tiếp
      patch.status = status;
    } else if (typeof payment_status === "string" && payment_status.length > 0) {
      // Trường hợp FE gửi `payment_status` -> map sang `status`
      patch.status =
        payment_status === "Paid" || payment_status === "Payment completed"
          ? "Payment completed"
          : "Payment pending";
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const order = await orderCollection.findByIdAndUpdate(orderId, patch, {
      new: true,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json(order);
  } catch (error) {
    console.error("updateOrdersts error:", error);
    return res.status(500).json({ message: "Failed to update order status" });
  }
};

/**
 * GET /getOrdersByUser/:userId
 */
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await orderCollection
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate("products.productId")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    console.error("getOrdersByUser error:", err);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/**
 * GET /restaurant/:restaurantId
 */
const restuarentOrder = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const orders = await orderCollection
      .find({
        "products.restaurantId": new mongoose.Types.ObjectId(restaurantId),
      })
      .populate({ path: "products.productId", select: "name price" })
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    console.error("restuarentOrder error:", err);
    return res.status(500).json({ message: "Error retrieving orders" });
  }
};

/**
 * DELETE /cart/clear/:userId
 */
const deleteCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await CartCollection.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
    });
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("deleteCart error:", error);
    return res.status(500).json({ message: "Failed to clear cart" });
  }
};

/**
 * PUT /cancelOrder/:id
 */
const CancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderCollection.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }
    order.status = "Cancelled";
    await order.save();
    return res.json({ success: true, message: "Order cancelled successfully" });
  } catch (err) {
    console.error("CancelOrder error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /Allorders
 */
const Allorders = async (req, res) => {
  try {
    const response = await orderCollection
      .find()
      .populate({ path: "products.productId", select: "name" })
      .sort({ createdAt: -1 });
    return res.status(200).json(response);
  } catch (err) {
    console.error("Allorders error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /Ordercount
 */
const Ordercount = async (req, res) => {
  try {
    const count = await orderCollection.countDocuments();
    return res.json({ count });
  } catch (err) {
    return res.status(500).json({ message: "internal server error" });
  }
};

/**
 * GET /turnover
 */
const getTotalTurnover = async (req, res) => {
  try {
    const orders = await orderCollection.find();
    const totalTurnover = orders.reduce(
      (acc, order) => acc + Number(order.totalAmount || 0),
      0
    );
    return res.status(200).json({ turnover: totalTurnover });
  } catch (err) {
    console.error("getTotalTurnover error:", err);
    return res.status(500).json({ message: "Error fetching total turnover" });
  }
};

/**
 * GET /getDeliveredOrders?restaurantId=...&startDate=...&endDate=...
 * (đang dùng field cũ status = "Order Delivered" cho phần báo cáo)
 */
const getDeliveredOrders = async (req, res) => {
  try {
    const { startDate, endDate, restaurantId } = req.query;
    if (!restaurantId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required params" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const orders = await orderCollection
      .find({
        "products.restaurantId": new mongoose.Types.ObjectId(restaurantId),
        status: "Your order has been delivered successfully",
        updatedAt: { $gte: start, $lte: end },
      })
      .populate("products.productId", "name price")
      .lean();

    const totalAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalCount = orders.length;

    return res.status(200).json({ orders, totalAmount, totalCount });
  } catch (error) {
    console.error("getDeliveredOrders error:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving delivered orders" });
  }
};

module.exports = {
  placeOrder,
  placeOrderSplit,
  getOrdersByUser,
  restuarentOrder,
  updateOrdersts,
  Allorders,
  deleteCart,
  Ordercount,
  getTotalTurnover,
  CancelOrder,
  getDeliveredOrders,
};
