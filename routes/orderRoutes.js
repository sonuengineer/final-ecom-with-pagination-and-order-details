const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.get("/", orderController.getOrders);

router.get("/:orderId", orderController.getOrdersByOrderId);

router.post("/addOrder",orderController.addOrder);

router.delete("/:orderId",orderController.deleteOrder);

module.exports = router;
