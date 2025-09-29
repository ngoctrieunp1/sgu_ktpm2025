const {Schema,model}=require("mongoose")
const mongoose = require('mongoose')
const CartSchema=new Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, // Reference to product
    quantity: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
},{timestamps:true})
const CartCollection=model("Cart",CartSchema)
module.exports=CartCollection