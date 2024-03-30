const { validationResult } = require("express-validator");
const Product = require("../model/product");

exports.CreateProduct = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.json(result);
    } else {
      const product = new Product(req.body);
      await product.save();
      res.json({
        data: product,
        message: "Product created successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.GetProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.UpdateProducts = async (req, res, next) => {
  try {
    let id = req.params.id;
    let existedProduct = await Product.findById(id);
    if (!existedProduct) {
      return res.status(404).json({
        error: "Invalid Product ID",
      });
    }
    if (req.body.title) {
      existedProduct.title = req.body.title;
    }
    if (req.body.description) {
      existedProduct.description = req.body.description;
    }
    if (req.body.image) {
      existedProduct.image = req.body.image;
    }
    if (req.body.price) {
      existedProduct.price = req.body.price;
    }
    await existedProduct.save();
    res.json({
      data: existedProduct,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.DeleteProduct = async (req, res, next) => {
  try {
    let id = req.params.id;
    let existedProduct = await Product.findById(id);
    if (!existedProduct) {
      return res.status(404).json({
        error: "Invalid Product ID",
      });
    } else {
      await Product.findByIdAndDelete(id);
    }
    res.json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
    });
  }
};
