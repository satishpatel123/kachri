const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
  products: [
    {
      productId: String,
      quantity: Number,
      price: Number,
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  price: {
    type: Number
  },

});

const Cart = mongoose.model("Order", orderSchema);

module.exports = Cart;
