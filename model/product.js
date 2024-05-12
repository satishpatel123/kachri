const mongoose = require("mongoose");
const mongooseIntl = require("mongoose-intl");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      intl: true,
    },
    description: {
      type: String,
      required: true,
      intl: true,
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
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

mongoose.plugin(mongooseIntl, {
  languages: ["en", "hi", "gu"],
  defaultLanguage: "en",
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
