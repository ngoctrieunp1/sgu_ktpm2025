const {Router}=require("express")
const OrderRoutes=Router()
const OrderController=require("../Controllers/OrderController")
OrderRoutes.post("/placeorder",OrderController. placeOrder)
OrderRoutes.get("/Allorders",OrderController. Allorders)
OrderRoutes.put("/cancelOrder/:id", OrderController.CancelOrder);
OrderRoutes.get('/getOrdersByUser/:userId',OrderController. getOrdersByUser)
OrderRoutes.get("/restaurant/:restaurantId",OrderController. restuarentOrder)
OrderRoutes.patch("/updateorder/:orderId",OrderController. updateOrdersts)
OrderRoutes.delete('/cart/clear/:userId',OrderController. deleteCart)
OrderRoutes.get("/Ordercount",OrderController.Ordercount)
OrderRoutes.get("/turnover", OrderController.getTotalTurnover);



module.exports=OrderRoutes