const express = require("express");
const cartController = require("../controllers/cartController");
const router = express.Router();

router.get("/", cartController.getCart);

router.get("/count", cartController.getCartCount);

router.get("/totalprice", cartController.getCartTotalPrice);

router.post("/:productId",cartController.addToCart);

router.delete("/:productId",cartController.deleteProductInCart);

module.exports = router;