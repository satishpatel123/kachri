const { validationResult } = require("express-validator");
const Product = require("../model/product");
const Image = require("../model/image");
var fs = require("fs");
var path = require("path");
require("dotenv").config();

exports.CreateProduct = async (req, res, next) => {
  try {
    var obj = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: req.files[0].filename,
    };
    let productId = await Product.create(obj);
    if (req.files.length > 0) {
      req.files.forEach(async (element) => {
        await Image.create({
          image: element.filename,
          product: productId._id,
        });
      });
    }
    res.json({
      data: productId,
      message: "Product created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.GetProducts = async (req, res, next) => {
  try {
    Product.setDefaultLanguage(req.headers.locale ?? "en");
    const products = await Product.find().sort({ type : 1});
    const productsList = [];
    if (products.length > 0) {
      products.forEach((element) => {
        productsList.push({
          title: element.title,
          description: element.description,
          price: element.price,
          image: "https://backend.kachari.in/uploads/" + element.image,
          _id: element._id,
          variant: element.variant,
        });
      });
    }
    res.json({
      data: productsList,
    });
  } catch (err) {
    console.log(err, "err");
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.GetAdminProducts = async (req, res, next) => {
  try {
    Product.setDefaultLanguage(req.query.locale ?? "en");
    const products = await Product.find();
    const productsList = [];
    if (products.length > 0) {
      products.forEach((element) => {
        productsList.push({
          title: element.title,
          description: element.description,
          price: element.price,
          image: element.image,
          _id: element._id,
        });
      });
    }

    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);

    // Calculate the start and end indexes for the requested page
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    // Slice the products array based on the indexes
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Calculate the total number of pages
    res.json({
      data: paginatedProducts,
      totalPages: products.length,
    });
  } catch (err) {
    console.log(err, "err");
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.UpdateProducts = async (req, res, next) => {
  try {
    let id = req.params.id;
    let existedProduct = await Product.findById(id);
    console.log(existedProduct);
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
    if (req.files && req.files.length > 0) {
      await Image.deleteMany({ product: req.params.id });
      req.files.forEach(async (element) => {
        await Image.create({
          image: element.filename,
          product: req.params.id,
        });
      });
    }
    res.json({
      data: existedProduct,
      success: true,
    });
  } catch (err) {
    console.log(err, "---err");
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.getProductId = async (req, res, next) => {
  try {
    Product.setDefaultLanguage(req.headers.locale ?? "en");
    let id = req.params.id;
    const products = await Product.findById(id);
    if (products) {
      products.image = "https://backend.kachari.in/uploads/" + products.image;
    }
    res.json({
      data: products,
    });
  } catch (err) {
    console.log(err);
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
