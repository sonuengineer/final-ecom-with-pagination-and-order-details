const Product = require("../models/product");

const limitProducts = 2; 

exports.getProducts = (req, res, next ) => {
    let page = 1;
    console.log("page:",req.query.page);
    if(req.query.page!=undefined){
        page = req.query.page;
    }
    Product.findAll({
        offset:((page-1)*limitProducts),
        limit : limitProducts,
        subQuery:false
    }).then(products => {
        res.json(products);
    }).catch(err => {
        console.log(err);
        res.status(500).json({success : false});
    });
}

exports.postAddProduct = async (req, res, next) => {
    try{
        const body = req.body;
        console.log(body);
        const product = await Product.create({ albumId : body.albumId, title : body.title, imageUrl : body.imageUrl, price : body.price});
        res.status(200).json({success : true});
    }catch(err) {
        console.log(err);
        res.status(500).json({success : false});
    };
}

exports.deleteProduct = (req, res, next ) => {
    try{
        const productId = req.params.productId;
        Product.findByPk(productId).then(product => {
            return product.destroy();
        }).then(result => {
            res.status(200).json({success : true});
        })

    }catch(err) {
        console.log(err);
        res.status(500).json({success : false});
    };
}

exports.getProductsCount = async (req, res, next ) => {
    try{
        let count = await Product.count();
        res.json(count);
    }catch(err){
        console.log(err);
        res.status(500).json({success : false});
    };
}