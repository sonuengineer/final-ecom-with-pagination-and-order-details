const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Product = sequelize.define("product", {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    description : {
        type : Sequelize.STRING,
        allowNull : false
    },
    title : {
        type : Sequelize.STRING,
        allowNull : false
    },
    imageUrl : {
        type : Sequelize.STRING,
        allowNull : false
    },
    price : {
        type : Sequelize.DOUBLE,
        allowNull : false
    },
    createdAt : {
        type : Sequelize.DATE,
        default : Date.now()
      },
      updatedAt : {
        type : Sequelize.DATE,
        default : Date.now()
      }
})

module.exports = Product;