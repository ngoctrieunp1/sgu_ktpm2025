const {Router}=require("express")
const Routes=Router()
const UserController=require("../Controllers/UserController")
const Auth=require("../MiddleWare/Auth")
Routes.post("/register",UserController.register)
Routes.post("/login",UserController.login)
Routes.get("/proview/:id",UserController.proview)
Routes.get("/AllUsers",UserController.AllUsers)
Routes.get("/Allres",UserController.Allres)
Routes.put("/updateprofile/:id",UserController.profileUpdate)
Routes.put("/block/:id",UserController.blockuser)
Routes.put('/unblock/:id', UserController.unblockUser);
Routes.get("/usercount",UserController.usercount)
Routes.get("/rescount",UserController.rescount)


module.exports=Routes
