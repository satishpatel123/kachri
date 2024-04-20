const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
  products: [
    {
      productId: String,
      title:String,
      image:String,
      description: String,
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
  orderDate: {
    type: Date,
  }
});

const Cart = mongoose.model("Order", orderSchema);

module.exports = Cart;
