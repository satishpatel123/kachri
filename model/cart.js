const mongoose = require("mongoose");

const { Schema } = mongoose;

const cartSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  price: {
    type: Number
  },
  products: [
    {
      productId: String,
      quantity: Number,
      name: String,
      price: Number
    }
  ],

});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
