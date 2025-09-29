// const orderCollection=require("../models/OrderModel")
// const productslCollection = require("../models/productModels")
// const CartCollection = require("../models/CartModels");


// // user can place order
// const placeOrder = async (req, res) => {
//   try {
//     const { userId, products, address } = req.body;

//     if (!userId || !products || !Array.isArray(products)) {
//       return res.status(400).json({ message: 'Invalid order data' });
//     }

//     const itemIds = products.map(p => p.productId);
//     const items = await productslCollection.find({ _id: { $in: itemIds } }).lean();

//     const orderProducts = [];

//     for (const p of products) {
//       const item = items.find(i => i._id.equals(p.productId));
//       if (!item) {
//         return res.status(400).json({ message: `Product not found for productId: ${p.productId}` });
//       }
//       orderProducts.push({
//         productId: p.productId,
//         name: item.name,
//         price: item.price,
//         quantity: p.quantity
//       });
//     }

//     const totalAmount = orderProducts.reduce((total, product) => total + (product.price * product.quantity), 0);

//     const order = new orderCollection({
//       userId,
//       address,
//       products: orderProducts,
//       totalAmount: totalAmount + 2, // Add delivery fee
//       status: 'Pending'
//     });

//     await order.save();
//     res.status(201).json(order);

//   } catch (error) {
//     console.error('Error placing order:', error);
//     res.status(500).json({ message: 'Error placing order', error: error.message });
//   }
// };

// const CancelOrder=async (req, res) => {
//   try {
//     const orderId = req.params.id;
//     const order = await orderCollection.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // Check if the order is already cancelled
//     if (order.status === 'Cancelled') {
//       return res.status(400).json({ message: 'Order is already cancelled' });
//     }

//     // Update order status to 'Cancelled'
//     order.status = 'Cancelled';
//     await order.save();

//     res.json({ success: true, message: 'Order cancelled successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // get all orders
// const Allorders=async (req, res) => {
//   try {
//     const response = await orderCollection.find().populate({path:'products.productId',select:'name'})
//     res.status(200).send(response);
//   } catch (err) {
//     console.error('Error fetching orders:', err); // Log full error details
//     res.status(500).send({ 
//       message: "Internal server error",
//       error: err.message,
//       stack: err.stack // Include stack trace for more insights
//     });
//   }
// }
// // get order by user 
// const getOrdersByUser =async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const orders = await orderCollection.find({ userId }).populate('products.productId');
//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// };


// // restaurent get their orders

// const restuarentOrder = async (req, res) => {
//   const restaurantId = req.params.userId; // Ensure this is correctly mapped
//   try {
//     const orders = await orderCollection.find({ restaurantId })
//       .populate({
//         path: 'products.productId',
//         select: 'name price', // You can select other fields as needed
//       });

//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(500).json({ message: 'Error retrieving orders', err });
//   }
// };

// // restaurent can update order status
// const updateOrdersts=async (req, res) => {
//   try {
//     console.log('Update request for order:', req.params.orderId);
//     const { status } = req.body;
//     const order = await orderCollection.findByIdAndUpdate(
//       req.params.orderId,
//       { status },
//       { new: true }
//     );
//     if (!order) {
//       console.log('Order not found');
//       return res.status(404).json({ message: 'Order not found' });
//     }
//     res.json(order);
//   } catch (error) {
//     console.error('Error updating order status:', error);
//     res.status(500).json({ message: 'Failed to update order status', error });
//   }
// }

// //when order is placed the cart item will empty
// const deleteCart= async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Remove all cart items for the user
//     await CartCollection.deleteMany({ userId });

//     res.status(200).json({ message: 'Cart cleared successfully' });
//   } catch (error) {
//     console.error('Error clearing cart:', error);
//     res.status(500).json({ message: 'Failed to clear cart', error: error.message });
//   }
// }

// // total order count
// const Ordercount=async (req,res)=>{
//   try{
//     const Ordercount=await orderCollection.countDocuments();
//     res.json({ count: Ordercount });

//   }catch(err){
//     return res.status(500).send("intenral server error");
//   }
// }
// //total turnover 
// const getTotalTurnover = async (req, res) => {
//   try {
//     const orders = await orderCollection.find(); // Fetch all orders
//     const totalTurnover = orders.reduce((acc, order) => acc + order.totalAmount, 0); // Sum of all totalAmount
//     res.status(200).json({ turnover: totalTurnover });
//   } catch (err) {
//     console.error('Error fetching total turnover:', err);
//     res.status(500).json({ message: 'Error fetching total turnover', error: err.message });
//   }
// };
// module.exports={
//     placeOrder,getOrdersByUser,restuarentOrder,updateOrdersts,Allorders,deleteCart,Ordercount,getTotalTurnover,CancelOrder
// }


////////////////////////////////////////////////////////////////

// const orderCollection = require("../models/OrderModel");
// const productslCollection = require("../models/productModels");
// const CartCollection = require("../models/CartModels");

// // user can place order
// const placeOrder = async (req, res) => {
//   try {
//     const { userId, products, address } = req.body;

//     if (!userId || !Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({ message: "Invalid order data" });
//     }

//     // Lấy thông tin sản phẩm để biết name/price/restaurantId chuẩn
//     const itemIds = products.map((p) => p.productId);
//     const items = await productslCollection
//       .find({ _id: { $in: itemIds } })
//       .select("_id name price restaurantId")
//       .lean();

//     const orderProducts = products.map((p) => {
//       const item = items.find((i) => String(i._id) === String(p.productId));
//       if (!item) {
//         throw new Error(`Product not found: ${p.productId}`);
//       }
//       return {
//         productId: item._id,
//         name: item.name,
//         price: Number(p.price ?? item.price ?? 0),
//         quantity: Number(p.quantity ?? 1),
//         restaurantId: item.restaurantId, // <-- QUAN TRỌNG
//       };
//     });

//     // Tính tổng + phí ship 2 (demo)
//     const subtotal = orderProducts.reduce(
//       (sum, pr) => sum + pr.price * pr.quantity,
//       0
//     );
//     const totalAmount = subtotal + 2;

//     // Lưu Order
//     const order = await orderCollection.create({
//       userId,
//       address,
//       products: orderProducts,
//       totalAmount,
//       status: "Pending",
//     });

//     return res.status(201).json(order);
//   } catch (err) {
//     console.error("placeOrder error:", err);
//     return res.status(400).json({
//       message: err?.message || "Create order failed",
//     });
//   }
// };

// // get all orders (admin)
// const Allorders = async (req, res) => {
//   try {
//     const response = await orderCollection
//       .find()
//       .populate({ path: "products.productId", select: "name" });
//     res.status(200).send(response);
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     res.status(500).send({
//       message: "Internal server error",
//       error: err.message,
//       stack: err.stack,
//     });
//   }
// };

// // get order by user
// const getOrdersByUser = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const orders = await orderCollection
//       .find({ userId })
//       .populate("products.productId");
//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch orders" });
//   }
// };

// // restaurant get their orders
// const restuarentOrder = async (req, res) => {
//   try {
//     const restaurantId = req.params.restaurantId; // route: /restaurant/:restaurantId
//     if (!restaurantId) {
//       return res.status(400).json({ message: "restaurantId is required" });
//     }

//     const orders = await orderCollection
//       .find({ "products.restaurantId": restaurantId })
//       .populate({ path: "products.productId", select: "name price" })
//       .sort({ createdAt: -1 });

//     return res.status(200).json(orders);
//   } catch (err) {
//     console.error("restuarentOrder error:", err);
//     return res
//       .status(500)
//       .json({ message: "Error retrieving orders" });
//   }
// };

// // restaurant can update order status
// const updateOrdersts = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const order = await orderCollection.findByIdAndUpdate(
//       req.params.orderId,
//       { status },
//       { new: true }
//     );
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.json(order);
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to update order status" });
//   }
// };

// // when order is placed the cart item will empty
// const deleteCart = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     await CartCollection.deleteMany({ userId });
//     res.status(200).json({ message: "Cart cleared successfully" });
//   } catch (error) {
//     console.error("Error clearing cart:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to clear cart" });
//   }
// };

// // total order count
// const Ordercount = async (req, res) => {
//   try {
//     const count = await orderCollection.countDocuments();
//     res.json({ count });
//   } catch (err) {
//     return res.status(500).send("internal server error");
//   }
// };

// // total turnover
// const getTotalTurnover = async (req, res) => {
//   try {
//     const orders = await orderCollection.find();
//     const totalTurnover = orders.reduce(
//       (acc, order) => acc + order.totalAmount,
//       0
//     );
//     res.status(200).json({ turnover: totalTurnover });
//   } catch (err) {
//     console.error("Error fetching total turnover:", err);
//     res
//       .status(500)
//       .json({ message: "Error fetching total turnover" });
//   }
// };

// // cancel order
// const CancelOrder = async (req, res) => {
//   try {
//     const orderId = req.params.id;
//     const order = await orderCollection.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     if (order.status === "Cancelled") {
//       return res.status(400).json({ message: "Order is already cancelled" });
//     }
//     order.status = "Cancelled";
//     await order.save();
//     res.json({ success: true, message: "Order cancelled successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   placeOrder,
//   getOrdersByUser,
//   restuarentOrder,
//   updateOrdersts,
//   Allorders,
//   deleteCart,
//   Ordercount,
//   getTotalTurnover,
//   CancelOrder,
// };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Server/Controllers/OrderController.js
const mongoose = require('mongoose');
const orderCollection = require('../models/OrderModel');
const productsCollection = require('../models/productModels');
const CartCollection = require('../models/CartModels');

/**
 * POST /placeorder
 * User tạo đơn hàng
 */
const placeOrder = async (req, res) => {
  try {
    const { userId, products, address } = req.body;

    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    // Lấy thông tin sản phẩm từ DB để có name/price/restaurantId chuẩn
    const itemIds = products.map((p) => p.productId);
    const items = await productsCollection
      .find({ _id: { $in: itemIds } })
      .select('_id name price restaurantId')
      .lean();

    // Lập danh sách sản phẩm của đơn (đảm bảo price/quantity là số)
    const orderProducts = products.map((p) => {
      const item = items.find((i) => String(i._id) === String(p.productId));
      if (!item) throw new Error(`Product not found: ${p.productId}`);

      const unitPrice = Number(
        item.price !== undefined ? item.price : p.price !== undefined ? p.price : 0
      );
      const qty = Number(p.quantity ?? 1);

      return {
        productId: item._id,
        name: item.name,
        price: unitPrice,
        quantity: qty,
        restaurantId: item.restaurantId, // QUAN TRỌNG để restaurant lọc đơn
      };
    });

    // Tính tổng tiền
    const subtotal = orderProducts.reduce(
      (sum, pr) => sum + pr.price * pr.quantity,
      0
    );
    const deliveryFee = 0; // phí ship demo
    const totalAmount = subtotal + deliveryFee;

    // Lưu đơn
    const order = await orderCollection.create({
      userId,
      address,
      products: orderProducts,
      totalAmount,
      status: 'Pending',
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('placeOrder error:', error);
    return res
      .status(400)
      .json({ message: error?.message || 'Create order failed' });
  }
};

/**
 * PATCH /updateorder/:orderId
 * Restaurant/Admin cập nhật trạng thái đơn
 */
const updateOrdersts = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderCollection.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    console.error('updateOrdersts error:', error);
    return res
      .status(500)
      .json({ message: 'Failed to update order status' });
  }
};

/**
 * GET /Allorders (admin)
 */
const Allorders = async (req, res) => {
  try {
    const response = await orderCollection
      .find()
      .populate({ path: 'products.productId', select: 'name' })
      .sort({ createdAt: -1 });
    return res.status(200).json(response);
  } catch (err) {
    console.error('Allorders error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /getOrdersByUser/:userId
 * Lấy đơn theo user
 */
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await orderCollection
      .find({ userId })
      .populate('products.productId')
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    console.error('getOrdersByUser error:', err);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/**
 * GET /restaurant/:restaurantId
 * Restaurant xem các đơn có món thuộc về mình
 */
const restuarentOrder = async (req, res) => {
  try {
    let restaurantId = String(req.params.restaurantId || '').trim();
    // Bỏ kí tự thừa nếu có
    restaurantId = restaurantId.replace(/^<|>$/g, '');
    if (!mongoose.isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: 'Invalid restaurantId' });
    }

    const orders = await orderCollection
      .find({ 'products.restaurantId': restaurantId })
      .populate({ path: 'products.productId', select: 'name price' })
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    console.error('restuarentOrder error:', err);
    return res.status(500).json({ message: 'Error retrieving orders' });
  }
};

/**
 * DELETE /cart/clear/:userId
 * Khi đặt hàng thành công, xóa giỏ hàng của user
 */
const deleteCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await CartCollection.deleteMany({ userId });
    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('deleteCart error:', error);
    return res
      .status(500)
      .json({ message: 'Failed to clear cart' });
  }
};

/**
 * PUT /cancelOrder/:id
 * User hủy đơn
 */
const CancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderCollection.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }
    order.status = 'Cancelled';
    await order.save();
    return res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('CancelOrder error:', err);
    return res.status(500).json({ message: 'Server error' });
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
    return res.status(500).json({ message: 'internal server error' });
  }
};

/**
 * GET /turnover
 * Tổng doanh thu (tổng totalAmount)
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
    console.error('getTotalTurnover error:', err);
    return res
      .status(500)
      .json({ message: 'Error fetching total turnover' });
  }
};

module.exports = {
  placeOrder,
  getOrdersByUser,
  restuarentOrder,
  updateOrdersts,
  Allorders,
  deleteCart,
  Ordercount,
  getTotalTurnover,
  CancelOrder,
};
