const { Router } = require("express");
const Route = Router();
const productController = require("../Controllers/Controller");
const Auth = require("../MiddleWare/Auth");

Route.post("/create", Auth, productController.create);             
Route.get("/view", productController.view);                       
Route.get("/myproduct", Auth, productController.getproductByRestuarent);  
Route.get("/getproducts/:id", productController.getproducts);            
Route.put("/update/:id", Auth, productController.update);              
Route.delete("/remove/:id", Auth, productController.remove);           
Route.get("/searchproduct", productController.searchproduct);
Route.get('/product/:id', productController.productview);              
Route.post('/product/:id/reviews', Auth, productController.addReview); 
Route.get('/restaurant/products-with-reviews', Auth, productController.getProductsWithReviewsByRestaurant);
Route.get('/getallreviews', productController.getAllProductsAndReviews); 
Route.get('/product/getReviews/:id', Auth, productController.getReviews ); 
Route.patch('/toggleproduct/:id', productController.toggleproduct ); 
Route.get("/productcount",productController.productcount)


module.exports = Route;
