const { Router } = require("express");
const CartRoutes = Router();
const CartController = require("../Controllers/CartController");
const Middle = require("../MiddleWare/Auth");

CartRoutes.post("/addCart", CartController.addTocart);                
CartRoutes.post('/remove/:itemId', CartController.removecart);        
CartRoutes.get("/cart/:userId", CartController.getcartuser);
CartRoutes.get("/item/:itemId", CartController.getItemDetails);
CartRoutes.post('/cart/update/:itemId', CartController.IncrementQuantity);
CartRoutes.post('/cart/decrement/:itemId', CartController.DecrementQuantity);



module.exports = CartRoutes;
