const { validationResult } = require("express-validator");
const Cart = require("../model/cart");
const Product = require("../model/product");

exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: userId });
    const product = await Product.findOne({ _id: productId });
    let name = product.title;
    let price = product.price;
    if (!product) {
      return res.status(404).send({ message: "item not found" });
    }
    if(cart) {
      let itemIndex = cart.products.findIndex(p => p.productId == productId);
      if (itemIndex > -1) {
        let productItem = cart.products[itemIndex];
        productItem.quantity += quantity;
        cart.price += quantity * product.price;
        cart.products[itemIndex] = productItem;
      } else {
        cart.price += quantity * product.price;
        cart.products.push({ productId, quantity, name, price });
      }
      cart = await cart.save();
      return res.status(201).send({ data : cart});
    } else {
      const newCart = await Cart.create({
        user : userId,
        products: [{ productId, quantity, name, price }],
        price: quantity * product.price
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.deleteCart = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: userId });
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).send({ message: "item not found" });
    }
    let itemIndex = cart.products.findIndex(p => p.productId == productId);
    if (itemIndex > -1) {
      let item = cart.products[itemIndex];
      cart.price -= item.quantity * item.price;
      if(cart.price < 0) {
          cart.price = 0
      }
      cart.products.splice(itemIndex, 1);
      cart.price = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
      },0)
      cart = await cart.save();
      res.status(200).send(cart);
    } else {
        res.status(404).send({ message : "item not found", status : false});
    }
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.getCartId = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    const cart = await Cart.find({ user: userId });
    if (!cart) {
      return res.status(200).json({
        message: "Cart Not found",
        status: false,
      });
    }
    res.json({
      data: cart,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "something went wrong",
    });
  }
};
