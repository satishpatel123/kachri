const mongoose = require("mongoose");

const { Schema } = mongoose;

const imageSchema = new Schema({
  image: {
    type: String,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
