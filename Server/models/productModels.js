const {Schema,model}=require("mongoose")
const mongoose = require('mongoose');
const reviewSchema = require('../models/ReviewModel');
const productSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    restaurantId:{
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'users', 
         required: true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    expired:{
        type:Boolean,
        default:false
    },
    disabled:{
        type:Boolean,
        default:false
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    reviews: [reviewSchema],
    numReviews: {
         type: Number,
          default: 0
    },
    rating: { 
        type: Number, 
        default: 0
     },
     
},{timestamps:true})
const productslCollection=model("products",productSchema)
module.exports=productslCollection
