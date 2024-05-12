const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  variant: {
    type: String,
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
