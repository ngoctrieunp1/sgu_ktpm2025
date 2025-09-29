const {Schema,model}=require("mongoose")
const validator=require("validator")
 jwt= require("jsonwebtoken")

const UserSchema=new Schema({
    name:{
        type:String,
        required:[true,"Name is Require"],
    },
    email:{
        type:String,
        required:[true,"Email is Require"],
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:[true,"Password is Require"],
        select:true
    },
    role:{
        type:String,
        required:[true,"please select a role"],
        enum:["user","Restaurant","Admin"]
    },
    blocked: {
        type: Boolean,
        default: false,
      },
    
},{timestamps:true})
const UserCollection=model("users",UserSchema)
module.exports=UserCollection