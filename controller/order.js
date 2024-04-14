const Order = require("../model/order");
const Address = require("../model/address");

exports.createOrder = async (req, res, next) => {
  try {
    const newAddress = await Address.create({
      ...req.body.address,
      userId: req.user.user_id,
    });
    const order = await Order.create({
      userId: req.user.user_id,
      products: req.body.products,
      price: req.body.total,
      addressId: newAddress._id,
    });
    res.status(200).json({
      message: "order created successfully",
      order: order,
      status: true,
    });
    // if (req.body.products && req.body.products.length > 0) {
    //   let products = [];
    //   let price = 0;
    //   let key = 0;
    //   for (const product of req.body.products) {
    //     if (product.productId) {
    //       let getProduct = await Product.findById(product.productId);
    //       if (getProduct) {
    //         products.push({
    //           productId: getProduct._id,
    //           quantity: req.body.products[key].quantity,
    //           price: getProduct.price * req.body.products[key].quantity,
    //           title: getProduct.title,
    //         });
    //         price += getProduct.price * parseInt(req.body.products[key].quantity);
    //       }
    //       key++;
    //     }
    //   }
    //   const newCart = await Order.create({
    //     userId: req.user.user_id,
    //     products: products,
    //     price: price,
    //   });

    //   res.json({
    //     data: newCart,
    //     message: "Order has been successfully",
    //     status: true,
    //   });
    // } else {
    //   res.status(200).json({
    //     message: "Product Not found",
    //     staus: false,
    //   });
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

exports.createOrderShipping = async (req, res, next) => {
  try {
    let existedAddress = await Address.findOne({ userId: req.user.user_id });
    let type = "";
    if (existedAddress) {
      type = 0;
      if (req.body.city) {
        existedAddress.city = req.body.city;
      }
      if (req.body.customerName) {
        existedAddress.customerName = req.body.customerName;
      }
      if (req.body.mobile) {
        existedAddress.mobile = req.body.mobile;
      }
      if (req.body.pincode) {
        existedAddress.pincode = req.body.pincode;
      }
      if (req.body.state) {
        existedAddress.state = req.body.state;
      }
      if (req.body.address) {
        existedAddress.address = req.body.address;
      }
      if (req.body.mobile) {
        existedAddress.mobile = req.body.mobile;
      }
      await existedAddress.save();
    } else {
      type = 1;
      const object = {
        city: req.body.city,
        customerName: req.body.customerName,
        mobile: req.body.mobile,
        pincode: req.body.pincode,
        state: req.body.state,
        address: req.body.address,
        userId: req.user.user_id,
      };
      await Address.create(object);
    }
    if (type) {
      res.json({
        message: "Address added has been successfully",
        status: true,
      });
    } else {
      res.json({
        data: "Address updated has been successfully",
        status: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    const order = await Order.find({ user: userId }).sort({ date: -1 });
    res.json({
      data: order,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "something went wrong",
    });
  }
};
