const express=require("express")
const cors=require("cors")
const app=express()

require("./config/db")
app.use(cors({
    origin:"http://localhost:3000",
    methods:"*"
}))
app.use(express.json())
const myroutes=require("./Routers/Routes")
const userRoutes=require("./Routers/UserRoutes")
const CartRoutes=require("./Routers/CartRoutes")
const orderRoutes=require("./Routers/OrderRoutes")
app.use("/",myroutes)
app.use("/",userRoutes)
app.use("/",CartRoutes)
app.use("/",orderRoutes)
app.listen(4000,(err)=>{
    if (err) process.exit(1);
    console.log("server is running");
})