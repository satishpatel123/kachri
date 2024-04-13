const { validationResult } = require("express-validator");
const Product = require("../model/product");
const Image = require("../model/image");
var fs = require('fs');
var path = require('path');

exports.CreateProduct = async (req, res, next) => {
  try {
    var obj = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: req.files[0].filename,
    }
    let productId = await Product.create(obj);
    if(req.files.length > 0) {
      req.files.forEach(async(element) => {
        await Image.create({
          image : element.filename,
          product: productId._id
        });
      });  
    }
    res.json({
      data: productId,
      message: "Product created successfully",
    });
  } catch (err) {
    console.log(err)
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
    console.log(err, "err")
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.UpdateProducts = async (req, res, next) => {
  try {
    let id = req.params.id;
    let existedProduct = await Product.findById(id);
    console.log(existedProduct)
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
    if (req.body.price) {
      existedProduct.price = req.body.price;
    }

    existedProduct.image = req.files[0].filename;
    await existedProduct.save();
    if(req.files && req.files.length > 0) {
      await Image.deleteMany({ product : req.params.id})
      req.files.forEach(async(element) => {
        await Image.create({
          image : element.filename,
          product: req.params.id
        });
      });  
    }
    res.json({
      data: existedProduct,
      success: true,
    });
  } catch (err) {
    console.log(err, '---err')
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.getProductId = async (req, res, next) => {
  try {
    let id = req.params.id;
    const products = await Product.findById(id);
    res.json({
      data: products,
    });
  } catch (err) {
    console.log(err)
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
