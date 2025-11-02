const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const orderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },

  address: {
    name:        { type: String, required: true },
    phoneNumber: { type: String, required: true },
    street:      { type: String, required: true },
    city:        { type: String, required: true },
    pincode:     { type: String, required: true },
  },

  products: [{
    productId:    { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    quantity:     { type: Number, required: true },
    price:        { type: Number, required: true },
    name:         { type: String, required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true } // <-- dòng bạn cần
  }],

  totalAmount: { type: Number, required: true },
  status:      { type: String, default: 'Payment pending' }
}, { timestamps: true });

// Tối ưu query cho Restaurant -> Orders
orderSchema.index({ 'products.restaurantId': 1, createdAt: -1 });

const orderCollection = model('orders', orderSchema);
module.exports = orderCollection;
