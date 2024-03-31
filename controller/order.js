const { validationResult } = require("express-validator");
const Cart = require("../model/cart");
const Order = require("../model/order");
const Product = require("../model/product");


exports.orderCheckout = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    const order = await Order.find({ user: userId }).sort({ date: -1 });;
    res.json({
      data: order,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "something went wrong",
    });
  }
};
