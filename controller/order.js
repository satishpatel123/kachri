const Order = require("../model/order");
const Address = require("../model/address");

exports.createOrder = async (req, res, next) => {
  try {
    console.log(req.body, "--req.body");
    const newAddress = await Address.create({
      ...req.body.address,
      userId: req.user.user_id,
    });
    const order = await Order.create({
      userId: req.user.user_id,
      products: req.body.products,
      price: req.body.total,
      addressId: newAddress._id,
      orderDate: new Date(),
    });
    res.status(200).json({
      message: "order created successfully",
      order: order,
      status: true,
    });
  } catch (error) {
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
    let userId = req.user.user_id;
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

exports.getAllOrders = async (req, res, next) => {
  try {
    const order = await Order.find()
      .populate("userId addressId")
      .sort({ date: -1 });

    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);

    // Calculate the start and end indexes for the requested page
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    // Slice the products array based on the indexes
    const paginatedOrders = order.slice(startIndex, endIndex);

    // Calculate the total number of pages
    res.json({
      data: paginatedOrders,
      totalPages: order.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "something went wrong",
    });
  }
};
