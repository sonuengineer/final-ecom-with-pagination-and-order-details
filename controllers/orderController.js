const Cart = require("../models/cart");
const Product = require("../models/product");
const CartItem = require("../models/cart-item");
const Order = require("../models/order");
const OrderItem = require("../models/order-item");

exports.getOrders = async (req, res, next) => {
    try{
        let allOrders = [];
        let orders = await Order.findAll({where : {userId : req.user.id}});
        for(let i=0;i<orders.length;i++){
            let orderItems = await OrderItem.findAll({where : { orderId : orders[i].id}});
            let orderDetails = [];
            for(let j=0;j<orderItems.length;j++){
                let product = await Product.findByPk(orderItems[j].productId);
                let orderObj = [orderItems[j], product];
                orderDetails.push(orderObj);
            }
            allOrders.push(orderDetails);
        }
        res.json({ data : allOrders, success : true });
    }catch(err){
        console.log(err);
        res.status(500).json({success : false});
    };
}


exports.getOrdersByOrderId = async (req, res, next) => {
    try{
        let orderId = req.params.orderId;
        let orders = await OrderItem.findAll({ where : { orderId : orderId}});
        return res.json({ data : orders, success : true});
    }catch(err){
        console.log(err);
        res.status(500).json({success : false});
    };
}


exports.addOrder = async (req, res, next) => {
    try{
        let results = [];
        let order = await req.user.createOrder();
        let cart = await req.user.getCart();
        let products = await cart.getProducts();
        for(let i=0;i<products.length;i++){
            console.log(products[i]);
            let result = await order.addProduct(products[i],{ 
                through : {
                    quantity : products[i].cartItem.quantity
                }
            });
            results.push(result);
        }
        CartItem.destroy({where : {cartId : cart.id}});
        res.json({ orderId : order.id, success : true});
    }catch(err){
        console.log(err);
        res.status(500).json({success : false});
    };
}


exports.deleteOrder = async (req, res, next) => {
    try{
        let orderId = req.params.orderId;
        Order.destroy({where : {id : orderId}});
        res.json({success : true})
    }catch(err){
        console.log(err);
        res.status(500).json({success : false});
    };
};