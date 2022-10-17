const productController = require("../controllers/productController");
const express = require("express");

const router = express.Router();

router.get("/", productController.getProducts);

router.get("/count", productController.getProductsCount);

router.post("/", productController.postAddProduct);

router.delete("/:productId",productController.deleteProduct);

module.exports = router;