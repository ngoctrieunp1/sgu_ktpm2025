const jwt= require("jsonwebtoken")
const bcrypt=require("bcrypt")
const mongoose=require('mongoose')
const UserCollection=require("../models/UserModels")

// signup
const register=async (req,res)=>{
  try{
   const {name,email,password,role}=req.body;
  
   console.log(req.body,password);
   const existingUser = await UserCollection.findOne({ email });
   if (existingUser) {
   return res.status(400).send({ message: 'User already exists' });
 }
 const hashedpassword=await bcrypt.hash(password,10);
   const response=await UserCollection.create({
      name,
      email,
      password:hashedpassword,
      role
   })
  
  
   if(response?._id){
   
      const token=jwt.sign({id:response._id,role:response.role},process.env.JWT_KEY,{expiresIn:"7d"})
      console.log(token);
      return res.status(200).send({ token, user: response });
      
  }
 
  
  }catch(err){
      console.log('register error:',err.message);
      return res.status(500).send({message:"internal server error"})
      
  }
}

//login
const login=async (req,res)=>{
  try{
      const {email,password}=req.body;
      if(!email || !password){
       return res.status(400).send("please provide email,password ")
      }
      
 const newuser=await UserCollection.findOne({email:email}).select('+password')
 if(!newuser){
  return res.status(400).send('invalid email or password')
 }
 if(newuser.blocked){
  return res.status(403).send('your account is blocked')
 }
 const hashpassword=newuser.password;
 const ispassword=await bcrypt.compare(password,hashpassword)
 if (!ispassword) {
  return res.status(400).send({ message: "Invalid email or password" });
}
 
  const token=jwt.sign({sub:newuser},process.env.JWT_KEY,{expiresIn:"7d"})
  
  return res.status(200).send({token:token,newuser})
}
  catch(err){
      console.log(err.message);
      return res.status(500).send({message:"internal server error"})
  }
}

// to view user details in profile page  
const proview=async(req,res)=>{
  try{
      
       const {id}=req.params
       const response=await UserCollection.findById(id)
       if (!response) {
        return res.status(404).send('User not found');                          
      }
      res.json(response);
  }catch(err){
      res.status(500).send({message:"internal server error"})
  }
}


// get all users 
const AllUsers = async (req, res) => {
  try {
    // Retrieve all users except admins
    const response = await UserCollection.find({ role:  "user" });
    res.status(201).send(response);
  } catch (err) {
    res.status(500).send({ message: "internal server error" });
  }
};

// get all restaurent
const Allres = async (req, res) => {
  try {
    // Retrieve all users except admins
    const response = await UserCollection.find({ role:  "Restaurant" });
    res.status(201).send(response);
  } catch (err) {
    res.status(500).send({ message: "internal server error" });
  }
};





//to update user details in profile page
const profileUpdate=async(req,res)=>{
  try{
        const {id}=req.params
        const body=req.body
        console.log(body);
        const updateProfile=await UserCollection.findByIdAndUpdate({_id:id},{name:req.body.name,email:req.body.email,role:req.body.role,password:req.body.password})
        res.status(201).send(updateProfile)
      }catch(err){
        res.status(500).send({message:"internal server error"})
      }
}

// Admin can block both user and restaurent 

const blockuser = async (req, res) => {
 try{
  const {id}=req.params;
  const user=await UserCollection.findByIdAndUpdate(id,{blocked:true},{new:true});
  if(!user){
  return res.status(404).send({message:"user not found"})
  }
  return res.status(200).send({user})
 } catch (error) {
  res.status(500).json({ message: 'Server error' });
}
}

// Admin can unblock both user and restaurent 
const unblockUser = async (req, res) => {
  try{
    const {id}=req.params;
    const user=await UserCollection.findByIdAndUpdate(id,{blocked:false},{new:true});
    if(!user){
    return res.status(404).send({message:"user not found"})
    }
    return res.status(200).send({user})
   } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

//total user count
const usercount=async (req,res)=>{
  try{
    const userrcount=await UserCollection.countDocuments({role:'user'});
    res.json({ count: userrcount });

  }catch(err){

  }
}

//total  restaurent count
const rescount=async (req,res)=>{
  try{
    const rescount=await UserCollection.countDocuments({role:'Restaurant'});
    res.json({ count: rescount });

  }catch(err){

  }
}


module.exports = {
  register, login, proview, profileUpdate, AllUsers,blockuser, unblockUser,usercount,rescount,Allres 
};

