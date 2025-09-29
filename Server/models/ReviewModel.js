const {Schema,model}=require("mongoose")
const mongoose = require('mongoose')
const reviewSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });

module.exports=reviewSchema