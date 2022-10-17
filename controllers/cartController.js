const Cart = require("../models/cart");
const Product = require("../models/product");
const CartItem = require("../models/cart-item");

const limitCartItems = 2;

exports.getCart = (req, res, next) => {
    let cartPage = 1;
    console.log("page:",req.query.page);
    if(req.query.page!=undefined){
        cartPage = req.query.page;
    }
    Cart.findAll().then(carts => {
        return carts[0].getProducts({
            offset:((cartPage-1)*limitCartItems),
            limit : limitCartItems,
            subQuery:false
        }).catch(err => console.log(err));
    }).then(products => {
        res.status(200).json(products);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({success : false});
    });
}

exports.addToCart = (req, res, next) => {
    const prodId = req.params.productId;
    // const prodCount = req.params.count;
    const prodCount = 1;
    let fetchedCart ;
    let newQuantity = 1;
    req.user.getCart().then(cart => {
        fetchedCart = cart;
        return cart.getProducts({where : { id : prodId }});
    }).then(products => {
        let product;
        if(products.length > 0){
            product = products[0];
        }

        if(product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity+prodCount;
            return product;
        }
        return Product.findByPk(prodId);
    }).then(product => {
        return fetchedCart.addProduct(product, {
            through: {quantity : newQuantity}
        });
    }).then((result)=>{
        res.status(200).json({success : true});
    }).catch(err => {
        console.log(err);
        res.status(500).json({success : false});
    });
} 

exports.deleteProductInCart = (req, res, next) => {
    const prodId = req.params.productId;
    CartItem.destroy({where : {productId : prodId}}).then(result => {
        console.log("result",result);
        res.status(200).json({success : true});
    }).catch(err => {
        console.log(err);
        res.status(500).json({success : false});
    });
}

exports.getCartCount = async (req, res, next ) => {
    try{
        let count = await CartItem.count();
        res.json(count);
    }catch(err){
        console.log(err);
        res.status(500).json({success : false});
    };
}

exports.getCartTotalPrice = async (req, res, next) => {
    try{
        //let cartItems = await CartItem.findAll();
        let totalprice = 0;
        let cart = await req.user.getCart();
        let cartItems = await cart.getProducts();
        for(let i=0;i<cartItems.length;i++){
            totalprice +=  cartItems[i].price * cartItems[i].cartItem.quantity;
        }
        console.log(totalprice);
        res.json(totalprice);
    }catch(err){
        console.log(err);
        res.status(500).json({success : false});
    };
}